import type { MediaItem } from '@/lib/search/types'

export const docA: MediaItem = {
  id: 1,
  suchtext:
    'J.Morris, Manchester Utd inside right 7th January 1948 UnitedArchives00421716 PUBLICATIONxINxGERxSUIxAUTxONLY',
  bildnummer: '0059987730',
  fotografen: 'IMAGO / United Archives International',
  datum: '01.01.1900',
  hoehe: '2460',
  breite: '3643',
}

export const docB: MediaItem = {
  id: 2,
  suchtext:
    'Michael Jackson 11 95 her Mann Musik Gesang Pop USA Hemd leger Studio hoch ganz stehend Bühne',
  bildnummer: '0056821849',
  fotografen: 'IMAGO / teutopress',
  datum: '01.11.1995',
  hoehe: '948',
  breite: '1440',
}

export const fixtureItems: MediaItem[] = [docA, docB]
