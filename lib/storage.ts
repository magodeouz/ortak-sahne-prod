import { supabase } from "./supabase"

export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "ortaksahne"

export async function uploadEventImage(file: File): Promise<{ publicUrl: string | null; error: any; path?: string }> {
  try {
    console.log("Debug - Storage upload starting with file:", file.name, file.size, file.type)
    console.log("Debug - STORAGE_BUCKET:", STORAGE_BUCKET)
    
    const fileExt = file.name.split(".").pop() || "jpg"
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
    const filePath = `events/${fileName}`
    
    console.log("Debug - Generated filePath:", filePath)

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    console.log("Debug - Upload error:", uploadError)

    if (uploadError) {
      console.error("Debug - Upload failed:", uploadError)
      return { publicUrl: null, error: uploadError }
    }

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)
    console.log("Debug - Public URL data:", data)
    return { publicUrl: data.publicUrl, error: null, path: filePath }
  } catch (err) {
    console.error("Debug - Storage upload exception:", err)
    return { publicUrl: null, error: err }
  }
}


