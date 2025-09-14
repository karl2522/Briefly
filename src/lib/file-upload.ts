import { createClient } from '@/lib/supabase/client'
import { FileUpload, SupportedFileType } from '@/lib/types'
import { extractTextFromFile } from './ai-service'

const supabase = createClient()

// Supported file types configuration
export const SUPPORTED_FILE_TYPES: SupportedFileType[] = [
  {
    type: 'text/plain',
    extensions: ['.txt'],
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  {
    type: 'application/pdf',
    extensions: ['.pdf'],
    maxSize: 10 * 1024 * 1024 // 10MB
  },
  {
    type: 'image/jpeg',
    extensions: ['.jpg', '.jpeg'],
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  {
    type: 'image/png',
    extensions: ['.png'],
    maxSize: 5 * 1024 * 1024 // 5MB
  },
  {
    type: 'image/webp',
    extensions: ['.webp'],
    maxSize: 5 * 1024 * 1024 // 5MB
  }
]

export class FileUploadService {
  /**
   * Validate file before upload
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    const maxSize = 10 * 1024 * 1024 // 10MB default
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
      }
    }
    
    // Check file type
    const supportedType = SUPPORTED_FILE_TYPES.find(
      type => type.type === file.type
    )
    
    if (!supportedType) {
      return {
        valid: false,
        error: `Unsupported file type. Supported types: ${SUPPORTED_FILE_TYPES.map(t => t.extensions.join(', ')).join(', ')}`
      }
    }
    
    return { valid: true }
  }
  
  /**
   * Upload file to Supabase Storage
   */
  static async uploadFile(
    file: File,
    userId: string,
    onProgress?: (progress: number) => void
  ): Promise<{ success: boolean; fileUpload?: FileUpload; error?: string }> {
    try {
      // Validate file
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('note-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        return { success: false, error: uploadError.message }
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('note-files')
        .getPublicUrl(fileName)
      
      // Create file upload record
      const { data: fileUpload, error: dbError } = await supabase
        .from('file_uploads')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
          processing_status: 'processing'
        })
        .select()
        .single()
      
      if (dbError) {
        return { success: false, error: dbError.message }
      }
      
      // Process file in background
      this.processFile(fileUpload.id, file)
      
      return { success: true, fileUpload }
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }
    }
  }
  
  /**
   * Process uploaded file (extract text, etc.)
   */
  private static async processFile(fileUploadId: string, file: File): Promise<void> {
    try {
      // Extract text from file
      const extractedText = await extractTextFromFile(file)
      
      // Update file upload record
      await supabase
        .from('file_uploads')
        .update({
          extracted_text: extractedText,
          processing_status: 'completed'
        })
        .eq('id', fileUploadId)
        
    } catch (error) {
      // Update status to failed
      await supabase
        .from('file_uploads')
        .update({
          processing_status: 'failed'
        })
        .eq('id', fileUploadId)
    }
  }
  
  /**
   * Get user's file uploads
   */
  static async getUserUploads(userId: string): Promise<FileUpload[]> {
    const { data, error } = await supabase
      .from('file_uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data || []
  }
  
  /**
   * Delete file upload
   */
  static async deleteFileUpload(fileUploadId: string, userId: string): Promise<boolean> {
    try {
      // Get file info
      const { data: fileUpload } = await supabase
        .from('file_uploads')
        .select('file_url')
        .eq('id', fileUploadId)
        .eq('user_id', userId)
        .single()
      
      if (!fileUpload) {
        return false
      }
      
      // Extract file path from URL
      const url = new URL(fileUpload.file_url)
      const filePath = url.pathname.split('/').slice(-2).join('/') // Get userId/filename
      
      // Delete from storage
      await supabase.storage
        .from('note-files')
        .remove([filePath])
      
      // Delete from database
      const { error } = await supabase
        .from('file_uploads')
        .delete()
        .eq('id', fileUploadId)
        .eq('user_id', userId)
      
      return !error
      
    } catch (error) {
      return false
    }
  }
  
  /**
   * Get file download URL
   */
  static async getDownloadUrl(fileUploadId: string, userId: string): Promise<string | null> {
    const { data: fileUpload } = await supabase
      .from('file_uploads')
      .select('file_url')
      .eq('id', fileUploadId)
      .eq('user_id', userId)
      .single()
    
    return fileUpload?.file_url || null
  }
}

// Export individual functions for convenience
export const validateFile = FileUploadService.validateFile
export const uploadFile = FileUploadService.uploadFile
export const getUserUploads = FileUploadService.getUserUploads
export const deleteFileUpload = FileUploadService.deleteFileUpload
export const getDownloadUrl = FileUploadService.getDownloadUrl
