export interface ProductModel {
  productCode: string
  productNameThai: string
  productNameEnglish: string
  palmProductNamet: string
  warehouseCode: string
  balanceOnHand: number
  balanceForInvoice: number
  qtyB: number
  qtyP: number
  packingSize: number
  unitPrice: number
  piecePrice: number
  barcode: string
  // mobile model
  orderB: number
  orderP: number
  outOfStockB: boolean
  outOfStockP: boolean
  canBreak: boolean
  sumPrice: number
  discount: number
  totalPrice: number
}
