const OpenAI = require('openai');
const Service = require('../models/Service');

// @desc    Analyze face shape and suggest hairstyles/beard styles
// @route   POST /api/ai/hairstyle
// @access  Private (Custom Choice)
const analyzeStyle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Design the prompt to get a structured JSON response
    const prompt = `
      Analyze this person's face from the image and respond with a JSON object.
      Identify the face shape and suggest 3-5 hairstyles and 2-3 beard styles that would suit them.
      
      Respond STRICTLY in the following JSON format:
      {
        "faceShape": "...",
        "hairstyles": ["...", "...", "..."],
        "beardStyles": ["...", "..."],
        "confidence": "low/medium/high",
        "explanation": "Brief tip for this face shape"
      }
      
      Only return JSON. No other text.
    `;

    // Process the image into base64 for OpenAI Vision API
    const base64Image = req.file.buffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${req.file.mimetype};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    let result;
    try {
      const content = response.choices[0].message.content.trim();
      // Sometimes models wrap JSON in markdown block: ```json ... ```
      const jsonStr = content.startsWith('```json') 
        ? content.slice(7, -3).trim() 
        : content;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', response.choices[0].message.content);
      return res.status(500).json({ message: 'AI returned invalid data format' });
    }

    // Map AI suggested hairstyles/beard styles to our existing database services
    // Search for service names that partially match the suggestions
    const matchedServices = await Service.find({
      $or: [
        ...result.hairstyles.map((style) => ({ name: { $regex: style, $options: 'i' } })),
        ...result.beardStyles.map((style) => ({ name: { $regex: style, $options: 'i' } })),
      ],
    }).limit(6);

    res.json({
      ...result,
      recommendedServices: matchedServices,
    });
  } catch (error) {
    console.error('AI Styling Error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { analyzeStyle };
