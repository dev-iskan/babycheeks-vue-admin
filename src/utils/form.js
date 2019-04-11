export const genders = [
  { value: 'm', text: 'Мальчики' },
  { value: 'f', text: 'Девочки' },
  { value: 'u', text: 'Юнисекс' }
]

export const apiKey = 'lw4jzx0h6ifi7igb38t24u62eiupzkrpttd4f9dhkizquji4'

export const rules = {
  required: v => !!v || 'Field is required',
  array: v => (!!v && !!v.length) || 'Field is empty'
}
