import { supabase } from '@/lib/db';
import Stripe from 'stripe';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';


export const dynamic = 'force-dynamic';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_123');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || 'AIza_mock');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');
    let event;

    try {
       
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
        console.error("Webhook Signature Error:", err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const email = session.customer_details?.email;
        const name = session.customer_details?.name;
        const amountTotal = session.amount_total / 100;
        const locationString = session.metadata?.locationString || "";
        const isMember = session.metadata?.isMember === 'true';

        try {
           
            const { data: customer } = await supabase
                .from('customers')
                .select('*')
                .eq('email', email)
                .single();

            let customerId;
            if (customer) {
                customerId = customer.customer_id;
                await supabase.from('customers').update({ 
                    total_revenue: (customer.total_revenue || 0) + amountTotal, 
                    is_gold_member: isMember || customer.is_gold_member 
                }).eq('customer_id', customerId);
            } else {
                const { data: newCust, error: custError } = await supabase
                    .from('customers')
                    .insert({ email, full_name: name, total_revenue: amountTotal, is_gold_member: isMember })
                    .select()
                    .single();
                if (custError) throw custError;
                customerId = newCust.customer_id;
            }

            
            const zipMatch = locationString.match(/\b\d{5}\b/);
            if (zipMatch) {
                const { data: partner } = await supabase
                    .from('partners')
                    .select('*')
                    .contains('coverage_zips', [zipMatch[0]])
                    .single();

                if (partner) {
                    const payout = amountTotal * 0.60;
                    await supabase.from('work_orders').insert({ 
                        partner_id: partner.partner_id, 
                        customer_id: customerId, 
                        service_address: locationString, 
                        payout_amount: payout, 
                        status: 'Dispatched' 
                    });

                   
                    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                    const prompt = `Write a professional dispatch email to ${partner.company_name}. 
                                   Job Address: ${locationString}. 
                                   Partner Payout: $${payout}. 
                                   Instruction: Must upload photos of the repair to the portal for payment.`;
                    
                    const result = await model.generateContent(prompt);
                    const emailContent = result.response.text();
                    
                  
                    if (process.env.RESEND_API_KEY) {
                        await resend.emails.send({
                            from: 'dispatch@electricdrs.com',
                            to: partner.email,
                            subject: `NEW JOB DISPATCHED: ${locationString}`,
                            text: emailContent
                        });
                    }
                }
            }
        } catch (dbError) {
            console.error("Database or AI Error:", dbError);
           ছি
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
}