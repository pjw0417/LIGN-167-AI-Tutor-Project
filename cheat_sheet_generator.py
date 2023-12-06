import os
from openai import OpenAI
from dotenv import load_dotenv
from flask import Flask, request, render_template, Response
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import pagesizes
from textwrap import wrap

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Set the API key from the .env file


# Initialize the OpenAI client with the API key
client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")
)

# Function to generate cheat sheet
def generate_cheat_sheet(topic):
    prompt = f'Create a comprehensive, detailed length cheat sheet summary for the topic: {topic} in UCSD LIGN 167 course (Deep Learning for Natural Language Understanding ), focusing on key concepts,mathematical logic, definitions, and examples.'
    try:
        response = client.chat.completions.create(
            model="gpt-4",  # Use the appropriate model for chat-based tasks
            messages=[
                {"role": "system", "content": "You are a chat assistant that generates detailed cheat sheets."},
                {"role": "user", "content":  prompt}
            ],
            temperature=0
        )
        cheat_sheet_response = response.choices[0].message.content
        return cheat_sheet_response
    
    except Exception as e:
        print(f"Error generating cheat sheet for {topic}: {type(e).__name__}, {e}")
        return f"Error generating cheat sheet for {topic}: {type(e).__name__}, {e}"

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        topics = request.form.getlist('topics')
        print("Selected topics:", topics)  # Debug print

        # Combine cheat sheets for all topics
        combined_cheat_sheet = ''
        for topic in topics:
            combined_cheat_sheet += f"\n\nCheat Sheet for {topic}:\n"
            combined_cheat_sheet += generate_cheat_sheet(topic)

        # Create a single PDF
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter
        c.setFont("Helvetica", 10)
        margin = 72
        x = margin
        y = height - margin
        line_height = 14
        
        wrapped_text = wrap(combined_cheat_sheet, 100)
        for line in wrapped_text:
            if y < margin:  # Stop if the content exceeds one page
                break
            c.drawString(x, y, line)
            y -= line_height

        c.save()
        buffer.seek(0)
        pdf_buffer = buffer.read()

        return Response(pdf_buffer, content_type='application/pdf', headers={'Content-Disposition': 'attachment; filename=combined_cheat_sheet.pdf'})
    return render_template('index.html', topics=TOPIC_LIST)

TOPIC_LIST = ["Supervised Learning", "Linear Regression", "Logistic Regression", 
              "Gradient Descent", 'Optimization through Gradient Descent','Multilayer Perceptrons',
              'Backpropagation','Deep Learning using Pytorch','Autoregressive Models', 
              'Attention in Transformer', 'Introduction to Transformers','Autoregressive Language Modeling',
              'Masked Language Modeling',"Encoder-Decoder Architectures",'The Future of Language Modeling']

@app.route('/download/<topic>')
def download_cheat_sheet(topic):
    pdf_buffer = generate_cheat_sheet(topic)
    if pdf_buffer:
        return Response(pdf_buffer, content_type='application/pdf', headers={'Content-Disposition': f'attachment; filename={topic}_cheat_sheet.pdf'})
    else:
        return "Error generating cheat sheet PDF"


if __name__ == '__main__':
    app.run(debug=True)
