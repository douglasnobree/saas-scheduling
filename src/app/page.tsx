import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Settings,
  Shield,
  BarChart,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Streamline Your Appointment Management
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything service providers need to manage
              appointments, clients, and services in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Calendar className="w-6 h-6" />,
                title: "Smart Scheduling",
                description:
                  "Intuitive calendar interface with daily and weekly views",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Multi-tenant Security",
                description:
                  "Isolated data for each business with enterprise-grade protection",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Client Management",
                description:
                  "Track client history and preferences in one place",
              },
              {
                icon: <Settings className="w-6 h-6" />,
                title: "Service Customization",
                description:
                  "Create and manage your service offerings with ease",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">
                Powerful Dashboard for Service Providers
              </h2>
              <p className="text-gray-600 mb-6">
                Take control of your business with our intuitive dashboard
                designed specifically for appointment-based services.
              </p>
              <ul className="space-y-3">
                {[
                  "Calendar interface with status indicators",
                  "Service management with duration and pricing",
                  "Client database with appointment history",
                  "Staff management with role permissions",
                  "Customizable booking flow",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Explore Dashboard
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                  alt="Dashboard Preview"
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Appointments Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Service Providers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our easy-to-use platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "1. Create Your Account",
                description:
                  "Sign up and configure your business profile with services and availability",
              },
              {
                icon: <Settings className="w-8 h-8" />,
                title: "2. Customize Your Services",
                description:
                  "Add your services with pricing, duration, and staff assignments",
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "3. Manage Appointments",
                description:
                  "Start accepting bookings and managing your calendar",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">{step.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Perfect For All Service Providers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform adapts to businesses of all types and sizes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Health & Wellness",
                icon: <BarChart className="w-6 h-6" />,
                description:
                  "Medical clinics, spas, fitness trainers, and therapists",
              },
              {
                title: "Professional Services",
                icon: <Shield className="w-6 h-6" />,
                description:
                  "Consultants, lawyers, accountants, and financial advisors",
              },
              {
                title: "Beauty & Personal Care",
                icon: <Users className="w-6 h-6" />,
                description:
                  "Hair salons, barber shops, nail salons, and makeup artists",
              },
              {
                title: "Education & Coaching",
                icon: <Calendar className="w-6 h-6" />,
                description:
                  "Tutors, coaches, instructors, and educational centers",
              },
              {
                title: "Home Services",
                icon: <Settings className="w-6 h-6" />,
                description:
                  "Cleaners, repair technicians, contractors, and inspectors",
              },
              {
                title: "Events & Entertainment",
                icon: <Clock className="w-6 h-6" />,
                description: "Photographers, DJs, event planners, and venues",
              },
            ].map((useCase, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-blue-600 mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your business size and needs. No
              hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Streamline Your Appointment Management?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of service providers who trust our platform to run
            their business.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Free
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
