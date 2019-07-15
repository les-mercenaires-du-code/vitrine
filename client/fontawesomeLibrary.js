import { library } from '@fortawesome/fontawesome-svg-core';
import { faReact } from '@fortawesome/free-brands-svg-icons/faReact';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import { faCoffee } from '@fortawesome/free-solid-svg-icons/faCoffee';


library.add(faReact, faCheckSquare, faCoffee);

/*

  Usage: There is two ways of using fontawesome components
    - <FontAwesomeIcon icon={['fab', 'react']} />
      => 'fab' is the prefix, you have to use this syntax for brands because
        default prefix is 'fas'
    - <FontAwesomeIcon icon="check-square" />
      => similar to <FontAwesomeIcon icon={['fas', 'check-square']} />

  Warning: Tree shaking does not seem to work => use deep import for now !
    use: import { faReact } from '@fortawesome/free-brands-svg-icons/faReact';
    instead of: import { faReact } from '@fortawesome/free-brands-svg-icons';
  // https://fontawesome.com/how-to-use/with-the-api/other/tree-shaking

  Docs:
    - all icons: https://fontawesome.com/icons?d=gallery
    - github: https://github.com/FortAwesome/react-fontawesome

 */
