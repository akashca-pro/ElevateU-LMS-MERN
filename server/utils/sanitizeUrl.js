import { sanitizeUrl } from "@braintree/sanitize-url";

export const sanitizeAndValidateUrl = (url)=>{
   const sanitizedUrl = sanitizeUrl(url)
   if (sanitizedUrl === "about:blank") {
    throw new Error("Potentially malicious Cloudinary URL detected!");
  }

  return sanitizedUrl
}