from pdf2docx import Converter
import os
import fitz  # PyMuPDF
from docx import Document
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import io

def convert_pdf_to_word(input_path):
    """Convert PDF to Word document"""
    output_path = input_path.replace('.pdf', '.docx')
    cv = Converter(input_path)
    cv.convert(output_path)
    cv.close()
    return output_path

def convert_word_to_pdf(input_path):
    """Convert Word document to PDF using python-docx and reportlab"""
    output_path = input_path.replace('.docx', '.pdf')
    
    try:
        # Load the Word document
        doc = Document(input_path)
        
        # Create PDF document
        pdf_doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Extract text from paragraphs
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                p = Paragraph(paragraph.text, styles['Normal'])
                story.append(p)
                story.append(Spacer(1, 12))
        
        # Build PDF
        pdf_doc.build(story)
        return output_path
        
    except Exception as e:
        # Fallback: try original method with COM
        try:
            from docx2pdf import convert
            import platform
            
            # Initialize COM for Windows
            if platform.system() == 'Windows':
                try:
                    import pythoncom
                    pythoncom.CoInitialize()
                except ImportError:
                    pass
            
            convert(input_path, output_path)
            return output_path
        except Exception as fallback_error:
            raise Exception(f"Both conversion methods failed: {str(e)}, fallback: {str(fallback_error)}")

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