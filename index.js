const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/assistant', async (req, res) => {
  const userInput = req.body.input;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo', // Use GPT-4 Turbo
        messages: [
          {
            role: 'system',
            content: `
            You are a helpful assistant designed to help users plan meals and create grocery lists based on their provided meal data.

            The user will provide you with a list that consists of Meals and their respective Ingredients.

            You will return a distribution from these meals across the next 7 days, taking into consideration Today + 6 next days.

            The format of the output should follow this structure and avoid adding any additional comment or acknowledgement:

            ## Meal Plan

            **[Today's day of the week]**

            * Lunch: [Meal Name]
            * Dinner: [Meal Name]

            **[Today +1 day]**

            * Lunch: [Meal Name]
            * Dinner: [Meal Name]

            **[Today +2 days]**

            * Lunch: [Meal Name]
            * Dinner: [Meal Name]

            **[Today +3 days]**

            * Lunch: [Meal Name]
            * Dinner: [Meal Name]

            **[Today +4 days]**

            * Lunch: [Meal Name]
            * Dinner: [Meal Name]

            **[Today +5 days]**

            * Lunch: [Meal Name]
            * Dinner: [Meal Name]

            **[Today +6 days]**

            * Lunch: [Meal Name]
            * Dinner: [Meal Name]

            ## Grocery's List

            **[Today's day of the week]**

            * Lunch: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            * Dinner: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            **[Today +1 day]**

            * Lunch: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            * Dinner: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            **[Today +2 days]**

            * Lunch: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            * Dinner: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            **[Today +3 days]**

            Lunch: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            Dinner: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            **[Today +4 days]**

            Lunch: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            Dinner: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            **[Today +5 days]**

            Lunch: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            Dinner: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            **[Today +6 days]**

            Lunch: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            Dinner: [Meal Name]

            - [ ] [Array of ingredients in each line separated by task list markdown]

            Important instructions:

            Return always the complete content

            If the user mentions that they have any ingredient, please mark the respective ingredients in the Grocery's list section with the task list markdown completed "[x]".

            If there are ingredients that are common across different meals, please mark them with the appropriate emoji that represents the number of times it is repeated across the Grocery Shopping List. For example, if Rice is an ingredient repeated two times across two different meals, then it would be 2️⃣.            .
            `,
          },
          { role: 'user', content: userInput },
        ],
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const assistantReply = response.data.choices[0].message.content;
    res.json({ reply: assistantReply });
  } catch (error) {
    console.error('Error communicating with OpenAI API:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
