# Firestore Data Structure for Marketplace

## Products Collection: `inventory/{docId}`

### Minimal Product (Data Score: ~20-30%)
```json
{
  "name": "Unknown Strain",
  "productName": "Unknown Strain",
  "companyName": "My Company",
  "companyId": "broker-uid",
  "vendorEmail": "contact@company.com",
  "quality": "INDOOR",
  "price": 10.00,
  "unit": "oz",
  "stock": 50,
  "imageUrl": "https://via.placeholder.com/400x400",
  "createdAt": serverTimestamp()
}
```
**Result**: Red card with low visibility, ranks lowest

---

### Good Product (Data Score: ~60-70%)
```json
{
  "name": "Premium Indoor Flower - Purple Haze",
  "productName": "Premium Indoor Flower - Purple Haze",
  "companyName": "My Company",
  "companyId": "broker-uid",
  "vendorEmail": "contact@company.com",
  "quality": "INDOOR",
  "strain": "Purple Haze",
  "thc": 22.5,
  "cbd": 0.8,
  "price": 12.99,
  "unit": "oz",
  "stock": 50,
  "imageUrl": "https://storage.example.com/image1.jpg",
  "images": [
    "https://storage.example.com/image1.jpg",
    "https://storage.example.com/image2.jpg",
    "https://storage.example.com/image3.jpg"
  ],
  "labPdf": "https://storage.example.com/lab-results.pdf",
  "createdAt": serverTimestamp()
}
```
**Result**: Yellow card with good visibility, sorts well with "Most Complete Data"

---

### Premium Product (Data Score: ~100%)
```json
{
  "name": "Premium Indoor Flower - Purple Haze",
  "productName": "Premium Indoor Flower - Purple Haze",
  "companyName": "Top Tier Growers",
  "companyId": "broker-uid-123",
  "vendorEmail": "sales@toptiergrowers.com",
  "quality": "INDOOR",
  "strain": "Purple Haze",
  "thc": 22.5,
  "cbd": 0.8,
  "price": 12.99,
  "unit": "oz",
  "stock": 150,
  "description": "Award-winning indoor flower with exceptional terpene profile",
  
  // Full image support
  "imageUrl": "https://storage.googleapis.com/traditions-c1cf5.appspot.com/products/image1.jpg",
  "images": [
    "https://storage.googleapis.com/traditions-c1cf5.appspot.com/products/image1.jpg",
    "https://storage.googleapis.com/traditions-c1cf5.appspot.com/products/image2.jpg",
    "https://storage.googleapis.com/traditions-c1cf5.appspot.com/products/image3.jpg",
    "https://storage.googleapis.com/traditions-c1cf5.appspot.com/products/image4.jpg"
  ],
  
  // Lab certification
  "labPdf": "https://storage.googleapis.com/traditions-c1cf5.appspot.com/labs/lab-results-2024-11.pdf",
  "labTesting": {
    "testedAt": "2024-11-15",
    "testedBy": "Certified Lab",
    "thc": 22.5,
    "cbd": 0.8,
    "pesticides": "PASSED",
    "microbial": "PASSED",
    "heavyMetals": "PASSED"
  },
  
  // Video walkthrough
  "video": "https://storage.googleapis.com/traditions-c1cf5.appspot.com/videos/product-walkthrough.mp4",
  
  // Terpene profile
  "terpenes": {
    "myrcene": 0.65,
    "limonene": 0.42,
    "caryophyllene": 0.35,
    "pinene": 0.18
  },
  
  // Effects/flavors (optional)
  "effects": ["Relaxing", "Euphoric", "Creative"],
  "flavors": ["Grape", "Berry", "Earthy"],
  
  "createdAt": serverTimestamp(),
  "updatedAt": serverTimestamp()
}
```
**Result**: Bright cyan card, ranks first in "Most Complete Data", maximum visibility

---

## Scoring Algorithm

The marketplace automatically calculates a `dataScore` (0-100) based on what fields are present:

```javascript
function calculateDataScore(data) {
  let score = 0;
  
  // 20 points for product name
  if (data.name) score += 20;
  
  // 20 points for primary image
  if (data.imageUrl || (data.images && data.images.length > 0)) score += 20;
  
  // 10 bonus points for multiple images
  if (data.images && data.images.length > 1) score += 10;
  
  // 20 points for lab PDF
  if (data.labPdf || data.labUrl) score += 20;
  
  // 20 points for video
  if (data.video) score += 20;
  
  // 5 bonus points for THC + CBD
  if (data.thc && data.cbd) score += 5;
  
  // 5 bonus points for strain info
  if (data.strain) score += 5;
  
  return Math.min(100, score); // Cap at 100
}
```

### Score Ranges:

| Score | Color | Visibility | Card Background |
|-------|-------|------------|-----------------|
| 0-30% | Red | Lowest | Dark red with gradient |
| 30-50% | Orange | Low | Dark orange with gradient |
| 50-70% | Yellow | Medium | Dark yellow with gradient |
| 70-90% | Emerald | High | Dark emerald with gradient |
| 90-100% | Cyan | Highest | Bright cyan with gradient |

---

## Quality Tiers Explained

### OUTDOOR
- **Growing Method**: Natural sunlight only
- **Timeline**: 4-6 months
- **Cost**: Lowest
- **Quality**: Entry-level
- **Badge Color**: Red (#ef4444)
- **Use Case**: Budget-conscious buyers

### LIGHT_DEPRIVATION
- **Growing Method**: Outdoor with controlled light cycles
- **Timeline**: Multiple harvests per year
- **Cost**: Mid-range
- **Quality**: Good
- **Badge Color**: Amber/Yellow (#eab308)
- **Use Case**: Regular bulk buyers

### LIGHT_ASSISTED
- **Growing Method**: Greenhouse + supplemental lighting
- **Timeline**: Controlled, consistent
- **Cost**: Premium
- **Quality**: High
- **Badge Color**: Orange (#f97316)
- **Use Case**: Quality-focused buyers

### INDOOR
- **Growing Method**: Full environmental control
- **Timeline**: Controlled cycles
- **Cost**: Highest
- **Quality**: Premium
- **Badge Color**: Emerald (#10b981)
- **Use Case**: Top-tier buyers

---

## Example: How to Update Product in Broker Dashboard

When a broker uploads/updates a product in their dashboard:

```javascript
// User fills out form
const productData = {
  name: "Purple Haze Flower",
  strain: "Purple Haze",
  quality: "INDOOR",
  thc: 22.5,
  cbd: 0.8,
  price: 12.99,
  unit: "oz",
  stock: 100
};

// Upload image(s)
const imageFile = await uploadToStorage(`products/${userId}/image1.jpg`, file);
productData.imageUrl = imageFile.url;
productData.images = [imageFile.url];

// Save to Firestore
await db.collection('inventory').doc(productId).set({
  ...productData,
  companyName: userProfile.companyName,
  companyId: userId,
  vendorEmail: userProfile.email,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});

// Score is calculated on client:
const score = calculateDataScore(productData); // ~40%
// Card displays as ORANGE with "40%" badge
```

---

## Migration: Converting Old Products to New Schema

If you have existing products in the old format:

```javascript
// OLD FORMAT
{
  productName: "Flower",
  category: "Cannabis",
  unit: "oz",
  price: "10",
  stock: "50",
  thc: "20",
  type: "Hybrid" // ← This was the old type
}

// NEW FORMAT (conversion needed)
{
  name: "Flower", // from productName
  productName: "Flower", // keep for backwards compat
  strain: "Hybrid", // from old 'type' field
  quality: "LIGHT_ASSISTED", // default quality tier
  thc: parseFloat(thc),
  cbd: 0.0, // add default
  price: parseFloat(price),
  unit: "oz",
  stock: parseFloat(stock),
  companyName: userData.companyName, // add vendor info
  companyId: userData.companyId,
  vendorEmail: userData.email,
  imageUrl: imageUrl, // ensure this exists
  createdAt: serverTimestamp()
}
```

---

## Testing Data for Marketplace

Insert these test products to see all quality tier colors and data scores:

```javascript
const testProducts = [
  {
    name: "Red Low Score",
    quality: "OUTDOOR",
    thc: 15,
    price: 8,
    unit: "oz",
    stock: 100
    // Only name → 20% score → RED
  },
  {
    name: "Orange Mid Score",
    quality: "LIGHT_DEPRIVATION",
    strain: "OG Kush",
    thc: 18,
    cbd: 1.2,
    price: 10,
    unit: "oz",
    stock: 50,
    imageUrl: "https://via.placeholder.com/400",
    images: ["https://via.placeholder.com/400"]
    // Name + image + strain + thc/cbd → 50% score → ORANGE
  },
  {
    name: "Yellow Good Score",
    quality: "LIGHT_ASSISTED",
    strain: "Girl Scout Cookies",
    thc: 20,
    cbd: 0.9,
    price: 12,
    unit: "oz",
    stock: 75,
    imageUrl: "https://via.placeholder.com/400",
    images: ["https://via.placeholder.com/400", "https://via.placeholder.com/400"],
    labPdf: "https://example.com/lab.pdf"
    // + multiple images + lab → 70% score → YELLOW
  },
  {
    name: "Cyan Perfect Score",
    quality: "INDOOR",
    strain: "Blue Dream",
    thc: 22,
    cbd: 0.8,
    price: 14,
    unit: "oz",
    stock: 150,
    imageUrl: "https://via.placeholder.com/400",
    images: ["https://via.placeholder.com/400", "https://via.placeholder.com/400", "https://via.placeholder.com/400"],
    labPdf: "https://example.com/lab.pdf",
    video: "https://example.com/video.mp4"
    // Everything + video → 100% score → CYAN
  }
];
```

---

**All data structures and calculations are ready for implementation!**
