import Together from 'together-ai';

const together = new Together();

// Function to summarize the note content using Together AI's LLM
export const summarizeNote = async (noteContent: string): Promise<string> => {
  try {
    // Use Together AI's chat completions API to summarize the note
    const stream = await together.chat.completions.create({
      model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',  // Replace with your model
      messages: [
        { role: 'user', content: `Summarize the following note content:\n\n${noteContent}` },
      ],
      stream: true,
    });

    let summary = '';
    for await (const chunk of stream) {
      // Append the content of each chunk to the summary
      summary += chunk.choices[0]?.delta?.content || '';
    }

    return summary.trim();
  } catch (error) {
    console.error('Error summarizing note:', error);
    throw new Error('Failed to summarize the note.');
  }
};

// Example usage
(async () => {
  const noteContent = 'This is an example note content that needs to be summarized.';
  try {
    const summary = await summarizeNote(noteContent);
    console.log('Summary:', summary);
  } catch (error) {
    console.error('Error:', error);
  }
})();
