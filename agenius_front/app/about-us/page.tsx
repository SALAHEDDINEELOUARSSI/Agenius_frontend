/**
 * v0 by Vercel.
 * @see https://v0.dev/t/t2X8lZBiH7W
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import React from 'react'

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full py-4 bg-white border-b border-gray-100 dark:bg-gray-950 dark:border-gray-800">
        <div className="container flex items-center justify-between px-4 md:px-6">
          <Link href="#" className="flex items-center space-x-2" prefetch={false}>
            <span className="sr-only">Agenius</span>
            <FlagIcon className="h-6 w-6" />
            <span className="font-bold tracking-tight">Agenius</span>
          </Link>
          <nav className="hidden space-x-4 text-sm font-medium lg:flex">
            <Link
              href="#"
              className="text-violet-900 hover:text-violet-900/90 dark:text-gray-50 dark:hover:text-violet-50/90"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="#aboutSection"
              className="text-violet-900 hover:text-gray-900/90 dark:text-gray-50 dark:hover:text-gray-50/90"
              prefetch={false}
            >
              About
            </Link>
            <Link
              href="#servicesSection"
              className="text-violet-900 hover:text-gray-900/90 dark:text-gray-50 dark:hover:text-gray-50/90"
              prefetch={false}
            >
              Services
            </Link>
            
            <Link
              href="#contactSection"
              className="text-violet-900 hover:text-gray-900/90 dark:text-gray-50 dark:hover:text-gray-50/90"
              prefetch={false}
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            
            <Link
              href="/login"
              className="text-sm font-medium text-gray-500 hover:text-violet-700/90  dark:text-gray-400 dark:hover:text-gray-400/90"
              prefetch={false}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-block text-sm font-medium rounded-md border border-transparent shadow-sm h-8 px-3 flex items-center justify-center bg-violet-700 text-gray-50 hover:bg-violet-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-violet-100 dark:text-gray-900 dark:hover:bg-violet-300 dark:focus-visible:ring-gray-300"
              prefetch={false}
            >
              Get Started
            </Link>
            <ThemeToggle> 

            </ThemeToggle>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-22" id="aboutSection">
          <div className="container flex flex-col items-center justify-center gap-8 px-4 text-center md:gap-10 md:px-6">
            <div className="space-y-3" >
              <h1 className="text-4xl font-bold text-violet-700 tracking-tighter sm:text-5xl md:text-6xl">About Us</h1>
              <p className="text-xl font-medium text-violet-400 dark:text-gray-300"> Hire the right talent. Instantly.</p>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
               
                Agenius is your intelligent recruiting agent. Powered by cutting-edge AI, we match companies with top candidates in record time — automatically, accurately, and effortlessly.
              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-22" id="servicesSection">
          <div className="container flex flex-col items-center justify-center gap-8 px-4 text-center md:gap-10 md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold  text-violet-700 tracking-tighter sm:text-4xl md:text-5xl">Our Mission</h2>
              <p className="text-xl font-medium text-violet-400 dark:text-gray-300"> Redefine how the world hires.</p>
              <p className="mx-auto max-w-3xl text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
               
                We empower organizations to hire smarter and faster through AI that understands both business needs and individual career aspirations.              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-22">
          <div className="container flex flex-col items-center justify-center gap-8 px-4 text-center md:gap-10 md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold  text-violet-700 tracking-tighter sm:text-4xl md:text-5xl">Our Values</h2>
              <p className="text-xl font-medium text-violet-400 dark:text-gray-300">Our values</p>

              <p className="mx-auto max-w-3xl text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                <p>Precision – Deliver highly relevant, tailored candidate matches.</p>

                <p>Transparency – Make every step of the hiring journey clear and fair.</p>

                <p>Efficiency – Cut hiring time from weeks to just days.</p>

                <p>Human-Centric – AI enhances decisions, but people remain at the core.</p>

                <p>Continuous Innovation – Our AI constantly learns and evolves.    </p>          

              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-22">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold  text-violet-700 tracking-tighter sm:text-4xl md:text-5xl">Meet the Team</h2>
                <p className="text-xl font-medium text-violet-400 dark:text-gray-300">The minds behind the machine.</p>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  A team of AI experts, recruitment specialists, and engineers — all working together to transform how talent connects with opportunity.
                </p>
          </div>
            <div className="grid w-full grid-cols-1 items-stretch justify-center md:grid-cols-4 lg:gap-4 xl:gap-8">
              <div className="flex flex-col gap-1.5">
                <img
                  src="/assets/image.jpg"
                  width="180"
                  height="180"
                  alt="Avatar"
                  className="mx-auto rounded-full overflow-hidden object-cover object-center"
                  style={{ aspectRatio: "180/180", objectFit: "cover" }}
                />
                <div className="mx-auto space-y-0.5">
                  <h3 className="text-lg font-bold">CHARI Milouda</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Software & AI engineer</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <img
                  src="/assets/cvMoi.jpg"
                  width="180"
                  height="180"
                  alt="Avatar"
                  className="mx-auto rounded-full overflow-hidden object-cover object-center"
                  style={{ aspectRatio: "180/180", objectFit: "cover" }}
                />
                <div className="mx-auto space-y-0.5">
                  <h3 className="text-lg font-bold">EL HOUCHI Loubna</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Software & AI engineer</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <img
                  src="/assets/image.jpg"
                  width="180"
                  height="180"
                  alt="Avatar"
                  className="mx-auto rounded-full overflow-hidden object-cover object-center"
                  style={{ aspectRatio: "180/180", objectFit: "cover" }}
                />
                <div className="mx-auto space-y-0.5">
                  <h3 className="text-lg font-bold">EL OUERSSI Salaheddine</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Software & AI engineer</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <img
                  src="/assets/cvMoi.jpg"
                  width="180"
                  height="180"
                  alt="Avatar"
                  className="mx-auto rounded-full overflow-hidden object-cover object-center"
                  style={{ aspectRatio: "180/180", objectFit: "cover" }}
                />
                <div className="mx-auto space-y-0.5">
                  <h3 className="text-lg font-bold">FARYAT Kaoutar</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Software & AI engineer</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-22">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter text-violet-700 sm:text-4xl md:text-5xl">Testimonials</h2>
              <p className="text-xl font-medium text-violet-400 dark:text-gray-300"> Our users love us.</p>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Here&apos;s what they&apos;re saying about our Solution.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 items-stretch justify-center md:grid-cols-2 md:gap-4">
              <div className="flex flex-col gap-2 p-4 border rounded-lg border-gray-200 bg-violet-50 shadow-sm max-w-sm justify-center md:p-8 md:gap-4 md:max-w-none  dark:border-gray-800 dark:bg-gray-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  &ldquo;Thanks to Agenius, we hired two back-end engineers in just 7 days. Impressive. &ldquo;

                </p>
                <div className="flex items-center space-x-2">
                  <div className="font-bold">SABER M.</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">(HR Director at TechBuild)</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4 border rounded-lg border-gray-200 bg-violet-50 shadow-sm max-w-sm justify-center md:p-8 md:gap-4 md:max-w-none  dark:border-gray-800 dark:bg-gray-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  &ldquo;The matching system is incredibly accurate — I found a job that’s a perfect fit.&rdquo;
                </p>
                <div className="flex items-center space-x-2">
                  <div className="font-bold">KADDARI Z.</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">(Data Analyst)</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4 border rounded-lg border-gray-200 bg-violet-50 shadow-sm max-w-sm justify-center md:p-8 md:gap-4 md:max-w-none dark:border-gray-800 dark:bg-gray-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  &ldquo;An incredible time-saver for our recruiters. The match quality is spot-on.&rdquo;
                </p>
                <div className="flex items-center space-x-2">
                  <div className="font-bold">TOUMI B. </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">(Talent Acquisition Manager)</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 p-4 border rounded-lg border-gray-200 bg-violet-50 shadow-sm max-w-sm justify-center md:p-8 md:gap-4 md:max-w-none  dark:border-gray-800 dark:bg-gray-950">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  &ldquo;We used to spend weeks screening candidates manually. With Agenius, the shortlist was ready in 48 hours — and it was spot-on.&rdquo;
                </p>
                <div className="flex items-center space-x-2">
                  <div className="font-bold">BELOUALI S. </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">(Talent Acquisition Manager)</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <section className="w-full py-12 md:py-24 bg-violet-100 dark:bg-gray-950">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
          <div className="space-y-3">
            <img
              src="/assets/image.jpg"
              width="140"
              height="70"
              alt="Logo"
              className="mx-auto"
              style={{ aspectRatio: "140/70", objectFit: "cover" }}
            />
            <div className="space-y-2 text-gray-900 md:text-base lg:text-sm xl:text-base dark:text-gray-50">
              <p>123 AL QODS Avenue, Oujda</p>
              <p>agenius@example.com</p>
              <p>0661122334</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center" id="contactSection">
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-violet-700  text-gray-50  px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:text-gray-900 dark:border-gray-800 dark:border-gray-800 dark:bg-violet-100 dark:hover:bg-violet-300 dark:hover:text-gray-900 dark:focus-visible:ring-gray-300"
              prefetch={false}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
       <footer className="border-t border-gray-100 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">&copy; 2025 Agenius . All rights reserved.</div>
          <nav className="flex items-center space-x-4">
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              prefetch={false}
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              prefetch={false}
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

function FlagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  )
}