import gulp from 'gulp';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import {build} from 'aurelia-cli';
import project from '../aurelia.json';

//import custom task
import prepareFontAwesome from './prepare-font-awesome';
import prepareBootstrapGlyphicon from './prepare-bootstrap-glyphicon';
import prepareSweetAlert2 from './prepare-sweetalert2';
import prepareTooltipster from './prepare-tooltipster';

export default gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processMarkup,
    processCSS,
    prepareFontAwesome,
    prepareBootstrapGlyphicon,
    prepareSweetAlert2,
    prepareTooltipster
  ),
  writeBundles
);

function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}
