export const translations = {
  en: {
    // Header
    title: "File Converter",
    subtitle: "Convert your files between different formats easily and securely",
    termsLink: "Terms and Conditions",
    
    // File Upload
    uploadTitle: "Upload Your Files",
    uploadSubtitle: "Drag and drop your files here, or click to browse",
    chooseFile: "Choose files or drag them here",
    supportedFormats: "Supported formats: MP3, WAV, M4A, JPG, PNG, SVG, PDF, DOCX",
    maxSize: "Max size: 100MB",
    dropHere: "Drop the file here",
    fileTypeNotSupported: "File type not supported",
    uploading: "Uploading...",
    
    // Uploaded File
    uploadedFile: "Uploaded File",
    file: "File",
    type: "Type",
    uploadNewFile: "Upload New File",
    
    // Conversion Options
    chooseConversion: "Choose Conversion",
    noConversionsAvailable: "No conversion options available for this file type.",
    
    // Conversion Labels
    mp3_to_wav: "MP3 → WAV",
    wav_to_mp3: "WAV → MP3",
    mp3_to_m4a: "MP3 → M4A",
    wav_to_m4a: "WAV → M4A",
    m4a_to_mp3: "M4A → MP3",
    m4a_to_wav: "M4A → WAV",
    jpeg_to_png: "JPEG → PNG",
    png_to_jpeg: "PNG → JPEG",
    png_to_svg: "PNG → SVG",
    jpeg_to_svg: "JPEG → SVG",
    svg_to_png: "SVG → PNG",
    svg_to_jpeg: "SVG → JPEG",
    pdf_to_word: "PDF → Word",
    word_to_pdf: "Word → PDF",
    pdf_to_png: "PDF → PNG",
    
    // Conversion Progress
    converting: "Converting your file...",
    pleaseWait: "Please wait while we process your file",
    
    // Download Section
    conversionComplete: "Conversion Complete!",
    successfullyConverted: "Successfully converted",
    to: "to",
    outputFile: "Output File",
    download: "Download",
    downloadAll: "Download All as ZIP",
    fileConvertedSuccessfully: "✅ Your file has been converted successfully",
    clickDownloadToSave: "✅ Click the download button to save your converted file",
    filesAutoDeleted: "✅ Files are automatically deleted from our servers after download",
    
    // Terms Modal
    termsAndConditions: "Terms and Conditions",
    close: "Close",
    termsNotAvailable: "Terms and conditions not available.",
    
    // Terms Acceptance
    acceptTerms: "I accept the terms and conditions",
    mustAcceptTerms: "You must accept the terms and conditions to continue",
    termsRequired: "Terms and conditions are required",
    
    // Language Selector
    english: "English",
    danish: "Dansk",
    
    // Error Messages
    uploadFailed: "Upload failed",
    conversionFailed: "Conversion failed",
    networkError: "Network error. Please try again.",
    fileNotFound: "File not found",
    downloadError: "Download error",
  },
  
  dk: {
    // Header
    title: "Fil Konverter",
    subtitle: "Konverter dine filer mellem forskellige formater nemt og sikkert",
    termsLink: "Vilkår og betingelser",
    
    // File Upload
    uploadTitle: "Upload Dine Filer",
    uploadSubtitle: "Træk og slip dine filer her, eller klik for at browse",
    chooseFile: "Vælg filer eller træk dem her",
    supportedFormats: "Understøttede formater: MP3, WAV, M4A, JPG, PNG, SVG, PDF, DOCX",
    maxSize: "Maks størrelse: 100MB",
    dropHere: "Slip filen her",
    fileTypeNotSupported: "Filtype understøttes ikke",
    uploading: "Uploader...",
    
    // Uploaded File
    uploadedFile: "Uploadet Fil",
    file: "Fil",
    type: "Type",
    uploadNewFile: "Upload Ny Fil",
    
    // Conversion Options
    chooseConversion: "Vælg Konvertering",
    noConversionsAvailable: "Ingen konverteringsmuligheder tilgængelige for denne filtype.",
    
    // Conversion Labels
    mp3_to_wav: "MP3 → WAV",
    wav_to_mp3: "WAV → MP3",
    mp3_to_m4a: "MP3 → M4A",
    wav_to_m4a: "WAV → M4A",
    m4a_to_mp3: "M4A → MP3",
    m4a_to_wav: "M4A → WAV",
    jpeg_to_png: "JPEG → PNG",
    png_to_jpeg: "PNG → JPEG",
    png_to_svg: "PNG → SVG",
    jpeg_to_svg: "JPEG → SVG",
    svg_to_png: "SVG → PNG",
    svg_to_jpeg: "SVG → JPEG",
    pdf_to_word: "PDF → Word",
    word_to_pdf: "Word → PDF",
    pdf_to_png: "PDF → PNG",
    
    // Conversion Progress
    converting: "Konverterer din fil...",
    pleaseWait: "Vent venligst mens vi behandler din fil",
    
    // Download Section
    conversionComplete: "Konvertering Gennemført!",
    successfullyConverted: "Konverteret med succes",
    to: "til",
    outputFile: "Output Fil",
    download: "Download",
    downloadAll: "Download Alle som ZIP",
    fileConvertedSuccessfully: "✅ Din fil er blevet konverteret med succes",
    clickDownloadToSave: "✅ Klik på download-knappen for at gemme din konverterede fil",
    filesAutoDeleted: "✅ Filer slettes automatisk fra vores servere efter download",
    
    // Terms Modal
    termsAndConditions: "Vilkår og betingelser",
    close: "Luk",
    termsNotAvailable: "Vilkår og betingelser ikke tilgængelige.",
    
    // Terms Acceptance
    acceptTerms: "Jeg accepterer vilkårene og betingelserne",
    mustAcceptTerms: "Du skal acceptere vilkårene og betingelserne for at fortsætte",
    termsRequired: "Vilkår og betingelser er påkrævet",
    
    // Language Selector
    english: "English",
    danish: "Dansk",
    
    // Error Messages
    uploadFailed: "Upload mislykkedes",
    conversionFailed: "Konvertering mislykkedes",
    networkError: "Netværksfejl. Prøv venligst igen.",
    fileNotFound: "Fil ikke fundet",
    downloadError: "Download fejl",
  }
};

export const getTranslation = (language, key) => {
  return translations[language]?.[key] || translations.en[key] || key;
}; 