import { GetStaticProps } from 'next';
import Image from 'next/image';
import { Episode } from '../core/models/episode';
import { api } from '../core/services/api';
import {format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../core/utils/convertDurationToTimeString';
import styles from './home.module.scss';
import Link from 'next/link';

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>

                  <p>{episode.members}</p>
                  <span>{episode.published_at}</span>
                  <span>{episode.file.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th style={{width: 72}}></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th style={{width: 100}}>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map(e => {
                return (
                  <tr key={e.id}>
                    <td>
                      <Image
                        width={120}
                        height={120}
                        src={e.thumbnail}
                        alt={e.title}
                        objectFit={'cover'}
                      >
                      </Image>
                    </td>
                    <td>
                      <Link href={`/episodes/${e.id}`}>
                        <a>{e.title}</a>
                      </Link>
                    </td>
                    <td>{e.members}</td>
                    <td>{e.published_at}</td>
                    <td>{e.file.durationAsString}</td>
                    <td>
                      <button type="button">
                        <img src="/play-green.svg" alt="Tocar episódio"/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get(
    'episodes',
    {
      params: {
        _limit: 12,
        _sort: 'published_at',
        _order: 'desc',
      }
    }
  );

  const episodes = data.map(e => {
    e.published_at = format(parseISO(e.published_at), 'd MMM yy', { locale: ptBR });
    e.file.duration = Number(e.file.duration);
    e.file.durationAsString = convertDurationToTimeString(e.file.duration);
    return e;
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
