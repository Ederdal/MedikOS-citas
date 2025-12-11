export interface SubItem {
  name: string
  route: string
}
export interface MenuItem {
  name: string
  iconPng: string
  iconGif: string
  route?: string
  children?: SubItem[]
}
