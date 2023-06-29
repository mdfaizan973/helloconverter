const express = require("express");
require("dotenv").config();
const path = require("path");

const app = express();
const port = 8888;
const cors = require("cors"); 
app.use(cors());
app.use(express.json());

const { Configuration, OpenAIApi } = require("openai");

async function generateCompletion(data) {
  try {
    const prompt = data;
    const maxTokens = 500;
    const n = 1;

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: maxTokens,
      n: n,
    });

    const { choices } = response.data;
    if (choices && choices.length > 0) {
      const completion = choices[0].text.trim();
      return completion;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

app.post("/convertcode", async (req, res) => {
  try {
    const { code, language } = req.body;

    let codes = await generateCompletion(
      `Convert the following code:-  ${code} to:\n${language} code. `
    );
    res.json({ codes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
app.post("/debugcode", async (req, res) => {
  try {
    const { code } = req.body;

    let response = await generateCompletion(
      `Debug the following code:-  ${code} \n please check if there is any error and also correct it. also if it's correct provide steps what code is doing and how we can improve it`
    );
    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
app.post("/checkquality", async (req, res) => {
  try {
    const { code } = req.body;

    let response = await generateCompletion(
      `Check the quality of the following code:-  ${code} \n Please provide a code quality assessment for the given code. Consider the following parameters:

      1. Code Consistency: Evaluate the code for consistent coding style, naming conventions, and formatting.
      2. Code Performance: Assess the code for efficient algorithms, optimized data structures, and overall performance considerations.
      3. Code Documentation: Review the code for appropriate comments, inline documentation, and clear explanations of complex logic.
      4. Error Handling: Examine the code for proper error handling and graceful error recovery mechanisms.
      5. Code Testability: Evaluate the code for ease of unit testing, mocking, and overall testability.
      6. Code Modularity: Assess the code for modular design, separation of concerns, and reusability of components.
      7. Code Complexity: Analyze the code for excessive complexity, convoluted logic, and potential code smells.
      8. Code Duplication: Identify any code duplication and assess its impact on maintainability and readability.
      9. Code Readability: Evaluate the code for readability, clarity, and adherence to coding best practices.
      
      Please provide a summary of the code quality assessment and a report showing the percentage-wise evaluation for each parameter mentioned above.`
    );
    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
