import { TokenService } from '@/services/storage.service'

export const dropzone = (
  maxFiles,
  url = `${process.env.VUE_APP_PROD_ROOT_API}admin/media/store`,
  acceptedFiles = 'image/*',
  paramName = 'image',
  addRemoveLinks = true,
  headers = {
    'Authorization': `Bearer ${TokenService.getToken()}`
  }
) => ({
  url,
  acceptedFiles,
  paramName,
  addRemoveLinks: true,
  maxFiles,
  headers
})

export const tinymce = {
  plugins: 'lists, table fullscreen',
  toolbar: `undo redo fullscreen | styleselect |
            bold italic |
            alignleft aligncenter alignright alignjustify |
            bullist numlist outdent indent`
}
