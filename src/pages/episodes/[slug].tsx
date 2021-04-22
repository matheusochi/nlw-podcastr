import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Episode } from '../../core/models/episode';
import { api } from '../../core/services/api';
import { convertDurationToTimeString } from '../../core/utils/convertDurationToTimeString';
import styles from './episode.module.scss';

type EpisodeProps = {
  episode: Episode
}

export default function EpisodePage({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href={'/'}>
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar"/>
          </button>
        </Link>
        <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio"/>
        </button>
      </div>

      <header className={styles.header}>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.published_at}</span>
        <span>{episode.file.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} />

    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode: Episode = data;
  episode.published_at = format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
  episode.file.duration = Number(data.file.duration);
  episode.file.durationAsString = convertDurationToTimeString(episode.file.duration);

  return {
    props: {
      episode
    },
    revalidate: 3600 * 24 * 3
  }
}
