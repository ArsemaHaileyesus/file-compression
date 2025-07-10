// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

export async function getData() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        throw new Error("DATABASE_URL is not set in environment variables.");
    }
    const sql = neon(dbUrl);
    // Example query, replace with your actual query
    const data = await sql`SELECT 1 as result`;
    return data;
}