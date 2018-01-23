export interface ProductModel {
  'productCode': string
  'assortedProductGroup': string 
  'productNameThai': string
  'productNameEnglish': string
  'palmProductNamet': string
  'warehouseCode': string
  'balanceOnHand': number
  'balanceForInvoice': number
  'qtyB': number
  'qtyP': number
  'packingSize': number
  'unitPrice': number
  'piecePrice': number
  'barcode': string
  // mobile model
  'discountPercent': number,
  'discountAmount': number,
  'specialPrice': number,
  'productInCart': boolean
  'orderB': number
  'orderP': number
  'outOfStockB': boolean
  'outOfStockP': boolean
  'canBreak': boolean
  'sumPrice': number
  'discount': number
  'totalPrice': number
  'premiumProduct': premiumProduct
}

interface premiumProduct {
  'premiumProductCode': string
  'premiumProductName': string
  'premiumProductPackingSize': number
  'premiumProductQty': number
  'premiumProductUnit': string
}
