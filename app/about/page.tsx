import { prisma } from "@/prisma/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function HomePage() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function addNote(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    if (!title || !content) return;

    try {
      await prisma.note.create({
        data: { title, content },
      });
    } catch (error) {
      console.error("Gagal menambah data (read-only environment):", error);
    }
    revalidatePath("/");
  }

  async function deleteNote(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    try {
      await prisma.note.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Gagal menghapus data (read-only environment):", error);
    }
    revalidatePath("/");
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>Catatan Sederhana (Prisma + SQLite)</h1>

      <form action={addNote} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
        <input type="text" name="title" placeholder="Judul catatan..." required style={{ padding: "0.5rem" }} />
        <textarea name="content" placeholder="Isi catatan..." required style={{ padding: "0.5rem" }} />
        <button type="submit" style={{ padding: "0.5rem", cursor: "pointer" }}>Tambah Catatan</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
        {notes.map((note) => (
          <li key={note.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "6px" }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <form action={deleteNote}>
              <input type="hidden" name="id" value={note.id} />
              <button type="submit" style={{ color: "red", cursor: "pointer" }}>Hapus</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}