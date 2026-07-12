import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TermsOfService() {
    const { i18n } = useTranslation();

    return (
        <div className="min-h-screen pt-24 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    {i18n.language === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                    Back to Home
                </Link>

                <div className="glass-strong rounded-3xl p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Terms of Service</h1>
                    <p className="text-muted-foreground mb-8">Effective Date: July 1, 2026</p>
                    
                    <div className="space-y-8 text-muted-foreground leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                            <p>
                                By creating an account or using RankBoost (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use the Service. We reserve the right to update these Terms at any time by posting the revised version on this page. Continued use of the Service after changes are posted constitutes your acceptance of the updated Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
                            <p className="mb-3">
                                RankBoost is a software-as-a-service (SaaS) platform that provides SEO keyword rank tracking, website SEO analysis, competitor monitoring, and AI-powered SEO consulting. The Service tracks the Google search engine rankings of your specified keywords and URLs, performs automated SEO audits of web pages, and provides actionable insights to help improve your website&apos;s search visibility.
                            </p>
                            <p>
                                The rank tracking data is sourced from third-party search engine results providers and may not reflect real-time or perfectly accurate positions for every query. Rankings can vary based on location, device, personalization, and other factors outside our control.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
                            <p className="mb-3">To access the Service, you must create an account by providing a valid name, email address, and password. You are responsible for:</p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Maintaining the confidentiality of your account credentials.</li>
                                <li>All activities that occur under your account.</li>
                                <li>Providing accurate and up-to-date information.</li>
                                <li>Notifying us immediately of any unauthorized use of your account.</li>
                            </ul>
                            <p className="mt-3">You may not create multiple accounts to circumvent usage limits. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">4. Subscription Plans and Pricing</h2>
                            <h3 className="text-lg font-medium text-foreground mb-2">4.1 Free Plan</h3>
                            <p className="mb-3">The Free plan includes tracking of up to 10 keywords and up to 10 SEO analyses per day. Free plan usage limits reset daily. The Free plan is available indefinitely at no cost.</p>
                            <h3 className="text-lg font-medium text-foreground mb-2">4.2 Pro Plan</h3>
                            <p className="mb-3">The Pro plan costs $3.00 USD per month and provides unlimited keyword tracking and unlimited SEO analyses. The Pro plan is billed monthly as a recurring subscription.</p>
                            <h3 className="text-lg font-medium text-foreground mb-2">4.3 Price Changes</h3>
                            <p>We reserve the right to modify pricing with at least 30 days&apos; notice. Existing subscribers will be notified of price changes before their next billing cycle.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">5. Payments and Billing</h2>
                            <p className="mb-3">All payments are processed securely through Stripe, Inc. By subscribing to the Pro plan, you authorize Stripe to charge your provided payment method on a recurring monthly basis.</p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Subscriptions automatically renew each month until cancelled.</li>
                                <li>If a payment fails, your account will be automatically downgraded to the Free plan.</li>
                                <li>You will receive an email receipt after each successful payment.</li>
                                <li>All prices are in US Dollars (USD) and do not include applicable taxes, which are your responsibility.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">6. Cancellation and Refunds</h2>
                            <h3 className="text-lg font-medium text-foreground mb-2">6.1 Cancellation</h3>
                            <p className="mb-3">You may cancel your Pro subscription at any time through the Stripe Customer Portal, accessible from your Settings page. Upon cancellation, you will retain Pro features until the end of your current billing period. After that, your account will automatically revert to the Free plan.</p>
                            <h3 className="text-lg font-medium text-foreground mb-2">6.2 Refund Policy</h3>
                            <p>Due to the digital nature of the Service, all payments are non-refundable. Since you can cancel at any time without penalty and there is no long-term commitment, refunds are not issued for partial billing periods or unused time. We encourage you to use the Free plan to evaluate the Service before upgrading.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">7. Account Deletion</h2>
                            <p>You may permanently delete your account at any time through the Settings page. Account deletion will immediately and permanently remove all of your data from our systems, including your profile, tracked keywords, rank history, SEO analysis reports, and notifications. If you have an active Pro subscription, it will be cancelled automatically upon account deletion. This action is irreversible.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">8. Acceptable Use</h2>
                            <p className="mb-3">You agree not to use the Service for any of the following prohibited activities:</p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>Scraping, crawling, or automated extraction of data from the Service for purposes other than personal use.</li>
                                <li>Reselling, redistributing, or sublicensing access to the Service or its data without our written permission.</li>
                                <li>Circumventing usage limits, rate limits, or authentication mechanisms.</li>
                                <li>Submitting malicious, fraudulent, or deceptive URLs or data.</li>
                                <li>Attempting to gain unauthorized access to other users&apos; accounts or data.</li>
                                <li>Using the Service to violate any applicable law or regulation.</li>
                                <li>Overloading or interfering with the Service&apos;s infrastructure.</li>
                            </ul>
                            <p className="mt-3">We reserve the right to suspend or terminate your account immediately and without notice if you violate any of these terms.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">9. Intellectual Property</h2>
                            <p>The Service, including its design, code, logos, and content, is owned by RankBoost and is protected by applicable intellectual property laws. You retain ownership of any data you submit to the Service (such as your keywords and URLs). By using the Service, you grant us a limited license to process your submitted data solely to provide the Service to you.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">10. Disclaimer of Warranties</h2>
                            <p>The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee that:</p>
                            <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
                                <li>The Service will be uninterrupted, error-free, or available at all times.</li>
                                <li>Rank tracking data will be 100% accurate or reflect real-time search engine positions.</li>
                                <li>SEO analysis recommendations will guarantee improved search rankings.</li>
                                <li>AI-generated insights will be free from errors or omissions.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">11. Limitation of Liability</h2>
                            <p>To the maximum extent permitted by applicable law, RankBoost and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, business opportunities, or goodwill, arising out of or related to your use of the Service. Our total liability for any claim arising from the Service shall not exceed the amount you paid to us in the 12 months preceding the claim, or $36.00 USD, whichever is less.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">12. Indemnification</h2>
                            <p>You agree to indemnify and hold harmless RankBoost, its operators, and affiliates from any claims, damages, losses, or expenses (including reasonable legal fees) arising from your use of the Service, your violation of these Terms, or your violation of any rights of a third party.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">13. Service Modifications and Termination</h2>
                            <p>We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We will make reasonable efforts to notify users of significant changes. We are not liable to you or any third party for any modification, suspension, or discontinuance of the Service.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">14. Governing Law</h2>
                            <p>These Terms shall be governed by and construed in accordance with the laws of the Arab Republic of Egypt. Any disputes arising from these Terms or the use of the Service shall be subject to the exclusive jurisdiction of the courts of Egypt.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">15. Severability</h2>
                            <p>If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect.</p>
                        </section>

                        <section className="pt-8 border-t border-border mt-4">
                            <h2 className="text-xl font-semibold text-foreground mb-3">16. Contact Us</h2>
                            <p className="mb-3">If you have any questions about these Terms of Service, please contact us at:</p>
                            <a href="mailto:support@rankboost.com" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                                <Mail size={16} />
                                support@rankboost.com
                            </a>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
