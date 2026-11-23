"use server";

import { prisma } from "@/prisma/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotes() {
  try {
    return await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Gagal membaca database:", error);
    return [];
  }
}

export async function addNoteAction(title: string, content: string) {
  try {
    await prisma.note.create({
      data: { title, content },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Tidak dapat menambah data: Vercel bersifat read-only untuk SQLite.",
    };
  }
}

export async function deleteNoteAction(id: number) {
  try {
    await prisma.note.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Tidak dapat menghapus data: Vercel bersifat read-only untuk SQLite.",
    };
  }
}