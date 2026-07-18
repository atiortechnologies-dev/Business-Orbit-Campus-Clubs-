/**
 * @file landingPageSeed.js
 * @description Script to populate the database with initial landing page content (FAQs, stats, logos).
 * @architecture Ensures consistency in development and production environments by automating initial dynamic content setup.
 */

const mongoose = require("mongoose");
const FAQ = require("../models/FAQ");
const Statistic = require("../models/Statistic");
const PartnerLogo = require("../models/PartnerLogo");
const SuccessStory = require("../models/SuccessStory");
const FeaturedStartup = require("../models/FeaturedStartup");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/bocc_db";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to Database. Purging old landing page data...");

    // Clear existing data
    await Promise.all([
      FAQ.deleteMany({}),
      Statistic.deleteMany({}),
      PartnerLogo.deleteMany({}),
      SuccessStory.deleteMany({}),
      FeaturedStartup.deleteMany({}),
    ]);

    console.log("Inserting mock data...");

    // 1. Seed FAQs
    await FAQ.insertMany([
      {
        question: "How do I join BOCC?",
        answer: "Click the Apply Now button and complete your profile.",
        pageType: "Student",
      },
      {
        question: "What is the startup journey?",
        answer:
          "We take you from idea to investment through rigorous incubation.",
        pageType: "Main Landing",
      },
      {
        question: "Can investors see my metrics?",
        answer: "Yes, premium investors get access to startup dashboards.",
        pageType: "Investor",
      },
    ]);

    // 2. Seed Statistics
    await Statistic.insertMany([
      {
        title: "Active Students",
        value: "10,000+",
        landingPage: "Main Landing",
      },
      { title: "Startups Funded", value: "50+", landingPage: "Investor" },
      { title: "Mentorship Hours", value: "5,000+", landingPage: "Mentor" },
    ]);

    // 3. Seed Partner Logos
    await PartnerLogo.insertMany([
      {
        name: "Tech Innovators",
        logoUrl: "https://placehold.co/200x100?text=Tech+Innovators",
        category: "Technology Partner",
      },
      {
        name: "Global Ventures",
        logoUrl: "https://placehold.co/200x100?text=Global+Ventures",
        category: "Business Partner",
      },
      {
        name: "State University",
        logoUrl: "https://placehold.co/200x100?text=State+University",
        category: "College",
      },
    ]);

    // 4. Seed Success Stories
    await SuccessStory.insertMany([
      {
        title: "From Dorm to Series A",
        description:
          "How Jane built a multi-million dollar SaaS product from her dorm room.",
        name: "Jane Doe",
        organization: "SaaSify",
        storyType: "Founder",
        featured: true,
      },
      {
        title: "Finding the perfect team",
        description: "BOCC connected me with the best engineers on campus.",
        name: "John Smith",
        organization: "TechConnect",
        storyType: "Incubator",
        featured: false,
      },
    ]);

    // 5. Seed Featured Startups
    await FeaturedStartup.insertMany([
      {
        startupName: "EcoWeb",
        founder: "Alice Green",
        stage: "Seed",
        industry: "Cleantech",
        fundingStatus: "Actively Raising",
        shortDescription: "AI-driven energy optimization for homes.",
        featured: true,
      },
      {
        startupName: "FinSync",
        founder: "Bob Blue",
        stage: "Series A",
        industry: "Fintech",
        fundingStatus: "Closed",
        shortDescription: "Seamless B2B payments infrastructure.",
        featured: true,
      },
    ]);

    console.log(
      "Seeding complete! Successfully populated all landing page CMS models.",
    );
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
