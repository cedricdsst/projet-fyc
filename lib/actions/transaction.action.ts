"use server";

import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database/mongoose";
import Transaction from "../database/models/transaction.model";
import { updateCredits } from "./user.actions";

export async function checkoutCredits(transaction) {
  // Connect to the database
  await connectToDatabase();

  // Create a new transaction in the database
  const newTransaction = await Transaction.create({
    ...transaction,
    buyer: transaction.buyerId,
  });

  // Update user credits based on the transaction
  await updateCredits(transaction.buyerId, transaction.credits);

  // Redirect to the success page (profile)
  redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile`);
}

export async function createTransaction(transaction) {
  try {
    await connectToDatabase();

    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: transaction.buyerId,
    });

    await updateCredits(transaction.buyerId, transaction.credits);
    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
}
