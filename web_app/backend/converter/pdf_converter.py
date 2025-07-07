from pdf2docx import Converter
import os
from docx2pdf import convert
import fitz  # PyMuPDF

def convert_pdf_to_word(input_path):
    """Convert PDF to Word document"""
    output_path = input_path.replace('.pdf', '.docx')
    cv = Converter(input_path)
    cv.convert(output_path)
    cv.close()
    return output_path

def convert_word_to_pdf(input_path):
    """Convert Word document to PDF"""
    output_path = input_path.replace('.docx', '.pdf')
    convert(input_path, output_path)
    return output_path

def convert_pdf_to_png(input_path):
    """Convert PDF to PNG format (first page only)"""
    output_path = input_path.replace('.pdf', '.png')
    
    # Open the PDF
    pdf_document = fitz.open(input_path)
    
    # Get the first page
    page = pdf_document[0]
    
    # Set zoom factor for better quality
    mat = fitz.Matrix(2.0, 2.0)
    
    # Render page to image
    pix = page.get_pixmap(matrix=mat)
    
    # Save as PNG
    pix.save(output_path)
    
    # Close the document
    pdf_document.close()
    
    return output_path