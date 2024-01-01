import PyPDF2
import langchain
import openai
import faiss
import requests

from PyPDF2 import PdfReader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import ElasticVectorSearch, Pinecone, Weaviate, FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI

import os
#print("Current Working Directory:", os.getcwd())
#reader = PdfReader("../LIGN 167 Resources/Goldberg Textbook.pdf")

#read data from the file and put them into a variable called raw_text

os.environ["OPENAI_API_KEY"] = "Your Own API Keys"
chain = load_qa_chain(OpenAI(), chain_type="stuff")
pdf_files = ['../../LIGN 167 Resources/Textbook.pdf', 
            "../../LIGN 167 Resources/Course Syllabus.pdf", 
            '../../LIGN 167 Resources/Pset1.pdf',
            '../../LIGN 167 Resources/pset2.pdf',
            '../../LIGN 167 Resources/pset3.pdf',
            '../../LIGN 167 Resources/pset4.pdf']
print("cwd:", os.getcwd())
raw_text = ''
for pdf_file in pdf_files:
    with open(pdf_file, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    raw_text += text + "\n"   


# Split the text that we read into smaller chunks so that during information retreival we don't hit the token size limits. 

text_splitter = CharacterTextSplitter(        
    separator = "\n",
    chunk_size = 1000,
    chunk_overlap  = 200,
    length_function = len,
)
texts = text_splitter.split_text(raw_text)
#print(texts[0])

# Download embeddings from OpenAI
embeddings = OpenAIEmbeddings()
docsearch = FAISS.from_texts(texts, embeddings)
print("Created Embeddings")

#model_name='gpt-4-1106-preview'
def chat_with_model(query):
    docs = docsearch.similarity_search(query)
    answer = chain.run(input_documents=docs, question=query)
    print(answer)
    return answer
