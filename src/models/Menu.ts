import { fabWhatsapp, fasBook, fasCashRegister } from '@quasar/extras/fontawesome-v6'

export const Menu = [
  {
    label: 'Payment',
    to: '/payments',
    icon: fasCashRegister
  },
  {
    label: 'About System',
    to: '/about',
    icon: fasBook
  },
  {
    label: 'Whatsapp',
    to: '',
    icon: fabWhatsapp
  }
]

export default Menu
