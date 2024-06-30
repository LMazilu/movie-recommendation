import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecommendationService {
  /**
   * Retrieves a recommendation based on the provided mood answers, content type, and genre.
   *
   * @param {string[]} moodAnswers - An array of strings representing the user's mood answers.
   * @param {string} contentType - The type of content to recommend (e.g. movie, TV show).
   * @param {string} genre - The genre of the content to recommend.
   * @return {Promise<any>} A promise that resolves to the parsed response containing the recommendation details.
   * @throws {Error} If there is an error generating the recommendation.
   */
  async getRecommendation(
    moodAnswers: string[],
    contentType: string,
    genre: string,
  ) {
    const prompt = this.generatePrompt(moodAnswers, contentType, genre);

    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      };
      const data = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      };
      const response = await axios.post(url, data, { headers });

      return this.parseResponse(response.data);
    } catch (error) {
      console.error('Errore nel generare la raccomandazione:', error);
      throw new Error('Errore nel generare la raccomandazione');
    }
  }

  /**
   * Generates a prompt for recommending a content based on the user's mood answers, content type, and genre.
   *
   * @param {string[]} moodAnswers - An array of strings representing the user's mood answers.
   * @param {string} contentType - The type of content to recommend (e.g. movie, TV show).
   * @param {string} genre - The genre of the content to recommend.
   * @return {string} The generated prompt.
   */
  generatePrompt(
    moodAnswers: string[],
    contentType: string,
    genre: string,
  ): string {
    return `
      Raccomanda un ${contentType} di genere ${genre} basato su queste risposte dell'umore: ${moodAnswers.join(', ')}.
      Fornisci il titolo, la descrizione, il cast, la durata e l'anno di uscita. Separa ciascuna informazione con un '\n'.
    `;
  }

  /**
   * Parses the response from the API and extracts the relevant information.
   *
   * @param {any} response - The response from the API.
   * @return {object} An object containing the parsed information.
   *                   The object has the following properties:
   *                   - title: The title of the recommended content.
   *                   - description: The description of the recommended content.
   *                   - cast: The cast of the recommended content.
   *                   - duration: The duration of the recommended content.
   *                   - year: The year of release of the recommended content.
   */
  parseResponse(response: any): any {
    const text = response.choices[0].message.content.trim();
    const lines = text
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line);

    const title = lines[0].replace('Titolo: ', '').replace(/["']/g, '');
    const description = lines[1].replace('Descrizione: ', '');
    const cast = lines[2]
      .replace('Cast: ', '')
      .split(', ')
      .map((name: string) => name.trim());
    const duration = lines[3].replace('Durata: ', '');
    const year = lines[4].replace('Anno di uscita: ', '');

    return {
      title,
      description,
      cast,
      duration,
      year,
    };
  }
}
