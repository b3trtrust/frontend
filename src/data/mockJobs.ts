import { categories } from "./categories"
import type { Job } from "@/types/job"

export const MOCK_JOBS: Job[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: [
    "Senior React Developer for DeFi Dashboard",
    "Smart Contract Auditor – Solidity",
    "UI/UX Designer for Web3 Marketplace",
    "Blockchain Data Analyst",
    "Full-Stack Engineer – Next.js & Rust",
    "Community Manager for NFT Project",
    "DevOps Engineer – Kubernetes & AWS",
    "Rust Developer for L2 Protocol",
    "Motion Designer for Product Launch",
    "Technical Writer – API Documentation",
    "AI Integration Engineer",
    "Growth Marketer – Web3 Startup",
  ][i],
  company:  ["IntroNet", "ChainLabs", "PixelDAO", "DataForge", "Metaworks", "CryptoHive"][i % 6],
  location: ["Remote", "Remote", "Hybrid – NYC", "Remote", "Remote", "Part-time"][i % 6],
  type:     ["Fixed", "Hourly"][i % 2],
  category: categories[i % categories.length].label,
  budget:   ["$300", "$1,200", "$500", "$2,500", "$800", "$4,000", "$650", "$3,200", "$400", "$750", "$1,800", "$900"][i],
  posted:   ["2m ago", "1h ago", "3h ago", "Yesterday", "2d ago", "5d ago"][i % 6],
  description:
    "We're looking for a talented professional to join our decentralized team. You'll work on cutting-edge blockchain infrastructure, collaborating with a fully remote crew across multiple time zones. Funds are locked in escrow on agreement and released upon verified delivery — you'll always get paid for good work.\n\nThis is a great opportunity to grow within the Web3 space with real impact on the product.",
  skills: [
    ["React", "TypeScript", "GraphQL"],
    ["Solidity", "Hardhat", "Foundry"],
    ["Figma", "Framer", "Tailwind"],
    ["Python", "SQL", "Dune Analytics"],
    ["Next.js", "Rust", "PostgreSQL"],
    ["Discord", "Twitter", "Community"],
  ][i % 6],
  avatar: "/images/profile-art.webp",
}))
