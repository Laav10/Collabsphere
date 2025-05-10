import Link from "next/link"
import { Twitter, Linkedin, DiscIcon as Discord } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-grey-950 text-white py-6 border-white border-1 border-solid px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm text-gray-400">All Rights Reserved inkyy.com {new Date().getFullYear()}</div>
        <div className="flex space-x-4">
          <Link href="https://twitter.com" className="text-white hover:text-gray-400 transition-colors mr-10 border-1 rounded-2xl">
            <Twitter size={20} />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="https://linkedin.com" className="text-white hover:text-gray-400 transition-colors mr-10 border-1 rounded-2xl">
            <Linkedin size={20} />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="https://discord.com" className="text-white hover:text-gray-400 transition-colors border-1 rounded-2xl ">
            <Discord size={20} />
            <span className="sr-only">Discord</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

