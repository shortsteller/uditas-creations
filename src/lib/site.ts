export const SITE = {
  name: "UDITAS CREATIONS",
  brandSubtitle: "Artisanal Junk & Fashion Jewellery Studio",
  tagline: "Handcrafted Statement Jewelry for Modern Queens",
  whatsapp: "916289400578",
  email: "moumitasaha2514@gmail.com",
  phone: "+91 6289400578",
  instagram: "https://instagram.com/uditascreations",
  facebook: "https://facebook.com/uditascreations",
  address: "Kolkata Atelier, Salt Lake Sector 5, Kolkata, West Bengal 700091, India",
};

export const DEFAULT_WA_MESSAGE =
  "Hello Uditas Creations! I'm reaching out regarding your handcrafted jewelry collection.";

export function waLink(message: string = DEFAULT_WA_MESSAGE) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
