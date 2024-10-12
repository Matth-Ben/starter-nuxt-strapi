import type { Struct, Schema } from '@strapi/strapi';

export interface CustomTexteEtLien extends Struct.ComponentSchema {
  collectionName: 'components_custom_texte_et_liens';
  info: {
    displayName: 'Texte et lien';
    icon: 'bulletList';
  };
  attributes: {
    Texte: Schema.Attribute.String;
    Url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'custom.texte-et-lien': CustomTexteEtLien;
    }
  }
}
