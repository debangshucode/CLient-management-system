"use client"
import { motion } from "framer-motion"
import Image from "next/image"

const sentence =
  "Our all-in-one client management platform is built to simplify and centralize your business operations — helping you manage clients, track projects, collaborate with your team, and handle invoicing and quotation generation with ease. Whether you're a freelancer, agency, or growing business, this platform brings everything together in one place so you can focus on delivering great work."

const AboutSection = () => {
  return (
    <section className="w-full  flex flex-col md:flex-row items-center justify-between px-6 py-20 max-w-7xl mx-auto gap-12">
     
      <motion.div
        className="md:w-1/2"
        initial={{ x: "-100%", opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight overflow-hidden relative">
          <motion.span
            initial={{ x: "-100%" }}
            whileInView={{ x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="inline-block"
          >
            Power Your Business
          </motion.span>
        </h2>

        <motion.p
          className="text-lg text-gray-300 leading-relaxed font-light"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          {sentence}
        </motion.p>
      </motion.div>

      <motion.div
        className="md:w-1/2 w-full flex justify-center"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="rounded-xl overflow-hidden shadow-2xl border border-neutral-700 bg-neutral-900 w-full max-w-2xl">
         
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border-b border-neutral-700">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          <Image
            src="/images/dashboard_img.png"
            alt="Dashboard preview"
            width={1200}
            height={700}
            className="w-full h-auto object-cover"
          />
        </div>
      </motion.div>
    </section>
  )
}

export default AboutSection
