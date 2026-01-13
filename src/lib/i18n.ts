export const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export const translations: Record<Locale, Record<string, string>> = {
  en: {
    'nav.library': 'My Library',
    'nav.discover': 'Discover',
    'nav.stats': 'Statistics',
    'nav.goals': 'Goals',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'books.addToLibrary': 'Add to Library',
    'books.currentlyReading': 'Currently Reading',
    'books.wantToRead': 'Want to Read',
    'books.finished': 'Finished',
  },
  es: {
    'nav.library': 'Mi Biblioteca',
    'nav.discover': 'Descubrir',
    'nav.stats': 'Estadísticas',
    'nav.goals': 'Objetivos',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'books.addToLibrary': 'Añadir a Biblioteca',
    'books.currentlyReading': 'Leyendo Actualmente',
    'books.wantToRead': 'Quiero Leer',
    'books.finished': 'Terminado',
  },
  fr: {
    'nav.library': 'Ma Bibliothèque',
    'nav.discover': 'Découvrir',
    'nav.stats': 'Statistiques',
    'nav.goals': 'Objectifs',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'books.addToLibrary': 'Ajouter à la Bibliothèque',
    'books.currentlyReading': 'En Cours de Lecture',
    'books.wantToRead': 'À Lire',
    'books.finished': 'Terminé',
  },
  de: {
    'nav.library': 'Meine Bibliothek',
    'nav.discover': 'Entdecken',
    'nav.stats': 'Statistiken',
    'nav.goals': 'Ziele',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'books.addToLibrary': 'Zur Bibliothek Hinzufügen',
    'books.currentlyReading': 'Derzeit Lesen',
    'books.wantToRead': 'Möchte Lesen',
    'books.finished': 'Fertig',
  },
  ja: {
    'nav.library': 'マイライブラリ',
    'nav.discover': '発見',
    'nav.stats': '統計',
    'nav.goals': '目標',
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.delete': '削除',
    'books.addToLibrary': 'ライブラリに追加',
    'books.currentlyReading': '現在読書中',
    'books.wantToRead': '読みたい',
    'books.finished': '完了',
  },
  zh: {
    'nav.library': '我的图书馆',
    'nav.discover': '发现',
    'nav.stats': '统计',
    'nav.goals': '目标',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'books.addToLibrary': '添加到图书馆',
    'books.currentlyReading': '正在阅读',
    'books.wantToRead': '想读',
    'books.finished': '已完成',
  },
};

export function getTranslation(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations[defaultLocale][key] || key;
}

export function useTranslation(locale: Locale = defaultLocale) {
  return {
    t: (key: string) => getTranslation(locale, key),
    locale,
  };
}
