import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { RecommendationRequest } from 'src/DTOs/RecommendationRequest.dto';
import { FilmApiResponseType } from 'src/types/FilmApiResponseType';
import { ParsedFilmType } from 'src/types/ParsedFilm';
import { RecommendationApiResponseType } from 'src/types/RecommendationApiResponseType';

@Injectable()
export class RecommendationService {
  async getRecommendationsByTopic(topic: string) {
    const prompt = this.generateTopicPrompt(topic);
    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      };
      const data = {
        model: 'gpt-4o',
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

      return await this.parseTopicResponse(response.data);
    } catch (error) {
      console.error('Errore nel generare la raccomandazione:', error);
      throw new Error('Errore nel generare la raccomandazione');
    }
  }

  generateTopicPrompt(topic: string) {
    return `Sei un assistente che propone dei film in base alle richieste del cliente. Devi rispondere sempre con una lista di 4 titoli in base al topic richiesto, e nient'altro. Non aggiungere commenti tuoi. Non ci devono essere titoli duplicati. Da qui il prompt: Raccomanda quattro film basati su o che abbia qualcosa a che fare con ${topic}.
      Fornisci i vari titoli e separa ciascuna informazione con un '\n'. Esempio di risposta:
      Titolo1: "Le ali della libertà"
Titolo2: "La La Land"
Titolo3: "Shrek"
Titolo4: "Avatar"`;
  }

  async parseTopicResponse(response: any): Promise<any> {
    const text = response.choices[0].message.content.trim();
    const lines = text
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line);

    const title1 = lines[0].replace('Titolo1: ', '').replace(/["']/g, '');
    const title2 = lines[1].replace('Titolo2: ', '').replace(/["']/g, '');
    const title3 = lines[2].replace('Titolo3: ', '').replace(/["']/g, '');
    const title4 = lines[3].replace('Titolo4: ', '').replace(/["']/g, '');

    const url1 = (
      await axios.get(
        `https://omdbapi.com/?t=${title1}&apikey=${process.env.OMDB_API_KEY}`,
      )
    ).data.Poster;
    const url2 = (
      await axios.get(
        `https://omdbapi.com/?t=${title2}&apikey=${process.env.OMDB_API_KEY}`,
      )
    ).data.Poster;
    const url3 = (
      await axios.get(
        `https://omdbapi.com/?t=${title3}&apikey=${process.env.OMDB_API_KEY}`,
      )
    ).data.Poster;
    const url4 = (
      await axios.get(
        `https://omdbapi.com/?t=${title4}&apikey=${process.env.OMDB_API_KEY}`,
      )
    ).data.Poster;

    return { title1, title2, title3, title4, url1, url2, url3, url4 };
  }

  /**
   * Retrieves a recommendation based on the provided mood answers, content type, and genre.
   *
   * @param {string[]} moodAnswers - An array of strings representing the user's mood answers.
   * @param {string} contentType - The type of content to recommend (e.g. movie, TV show).
   * @param {string} genre - The genre of the content to recommend.
   * @return {Promise<any>} A promise that resolves to the parsed response containing the recommendation details.
   * @throws {Error} If there is an error generating the recommendation.
   */
  async getFinalRecommendation(request: RecommendationRequest) {
    const prompt = this.generateFinalPrompt(request);

    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      };
      const data = {
        model: 'gpt-4o',
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
      const parsedResponse = await this.parseFinalResponse(response.data);

      return parsedResponse;
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
  generateFinalPrompt(request: RecommendationRequest): string {
    return `Sei un assistente che aiuta l'user a scegliere 4 film, serie o cartone in base alle sue richieste. Devi rispondere sempre con un titolo, una descrizione, il cast, la durata e l'anno di uscita, senza aggiungere commenti tuoi. 
Da qui il prompt: Raccomanda 4 ${request.contentType} che abbiano generi di  ${request.genre1} e ${request.genre2}, basati su questa risposta dell'umore: ${request.feeling}. Tieni a mente che all'user piace il film ${request.moviePreference}, quindi è possibile che gli aggradi qualcosa di simile.
Il film deve anche incentrarsi in qualche modo (o con l'anno di uscita o che tratti di quegli anni) sugli anni ${request.years}
Fornisci la risposta in formato JSON, avendo cura di separare i film tramite oggetto unico "films" con all'interno oggetti "film" contenenti il titolo, la descrizione, il cast, la durata e l'anno di uscita.
Fornisci inoltre quello che può essere un mood in base alle risposte che ti vengono fornite.
I possibili mood sono: Felice, Impegnato, Malinconico, Energico, Stanco, Creativo.
Non fornire mai due film uguali.
Esempio di risposta:
{
  "mood": "Creativo",
  "films": [
    {
      "film": {
        "titolo": "Shaun of the Dead",
        "descrizione": "Shaun è un commesso pigro che si ritrova nel mezzo di un'apocalisse zombie. Insieme al suo migliore amico, cerca di salvare la sua amata e la sua madre portandole al luogo più sicuro che conosce: il pub locale.",
        "cast": "Simon Pegg, Nick Frost, Kate Ashfield",
        "durata": "99 minuti",
        "anno": "2004"
      }
    },
    {
      "film": {
        "titolo": "Tucker and Dale vs. Evil",
        "descrizione": "Due amici, Tucker e Dale, vengono scambiati per maniaci assassini quando un gruppo di studenti universitari inizia a morire accidentalmente intorno alla loro baita in montagna.",
        "cast": "Tyler Labine, Alan Tudyk, Katrina Bowden",
        "durata": "89 minuti",
        "anno": "2010"
      }
    },
    {
      "film": {
        "titolo": "What We Do in the Shadows",
        "descrizione": "Un documentario fittizio sulle vite di quattro vampiri coinquilini che cercano di trovare il loro posto nella moderna vita notturna di Wellington.",
        "cast": "Jemaine Clement, Taika Waititi, Jonathan Brugh",
        "durata": "86 minuti",
        "anno": "2014"
      }
    },
    {
      "film": {
        "titolo": "Scary Movie",
        "descrizione": "Una parodia dei film horror in cui un gruppo di amici affronta situazioni assurde e clownesche ispirate ai film del genere.",
        "cast": "Anna Faris, Jon Abrahams, Marlon Wayans",
        "durata": "88 minuti",
        "anno": "2000"
      }
    }
  ]
}`;
  }

  /**
 * Parses the response from the API and extracts the relevant information.
 *
 * @param {any} response - The response from the API.
 * @return {object} An object containing the parsed information.
 *                   The object has the following properties:
 *                   - mood: The mood related to the recommendation.
 *                   - films: An array of objects containing recommended films.
 *                             Each film object has the following properties:
 *                             - title: The title of the recommended film.
 *                             - description: The description of the recommended film.
 *                             - cast: The cast of the recommended film.
 *                             - duration: The duration of the recommended film.
 *                             - year: The year of release of the recommended film.
 *                             - url: The URL of the poster for the recommended film.
 */
 async parseFinalResponse(response: any): Promise<{ mood: string, films: ParsedFilmType[] }> {
  let text = response.choices[0].message.content.trim();

  // Remove the "```json" at the beginning and "```" at the end
  if (text.startsWith('```json')) {
    text = text.substring(7);
  }
  if (text.endsWith('```')) {
    text = text.substring(0, text.length - 3);
  }

  // Parse the JSON text
  const parsedResponse = JSON.parse(text);

  const mood = parsedResponse.mood;
  const films: ParsedFilmType[] = await Promise.all(
      parsedResponse.films.map(async (filmData: FilmApiResponseType) => {
      const film = filmData.film;
      const titolo = film.titolo;
      const descrizione = film.descrizione;
      const cast = film.cast;
      const durata = film.durata;
      const annoDiUscita = film.anno;

      // Fetch poster URL using OMDB API
      const omdbResponse = await axios.get(
        `https://omdbapi.com/?t=${titolo}&apikey=${process.env.OMDB_API_KEY}`,
      );
      const url = omdbResponse.data.Poster;

      return {
        title: titolo,
        description: descrizione,
        cast: cast,
        duration: durata,
        year: annoDiUscita,
        url: url,
      };
    }),
  );

  return { mood, films };
}
}
