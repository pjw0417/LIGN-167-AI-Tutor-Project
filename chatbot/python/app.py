from flask import Flask, request, jsonify, render_template
from pdf_query import chat_with_model
import os

app = Flask(__name__, template_folder='../templates')

@app.route('/', methods= ['GET', 'POST'])
def home():
    response = ""
    if request.method == "POST":
        user_input = request.form["message"]
        response = chat_with_model(user_input)
    return render_template("index.html", response=response)

'''# Define the chatbot route
@app.route("/chatbot", methods=["POST"])
def chatbot():
    user_input = request.form["message"]
    chat_history = []  # Note: This will reset each time; consider using sessions for persistent history
    response = chat_with_model(user_input).text.strip()
    print(response)
    chat_history.append(f"User: {user_input}\nChatbot: {response}")
    return render_template(
        "chatbot.html",
        user_input=user_input,
        response=response,
    )
'''
# Start the Flask app
if __name__ == "__main__":
    app.run(debug=False)
