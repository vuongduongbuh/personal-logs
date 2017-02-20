import gulp from 'gulp';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import {build} from 'aurelia-cli';
import project from '../aurelia.json';

//import custom task
import prepareFontAwesome from './prepare-font-awesome';
import prepareBootstrapGlyphicon from './prepare-bootstrap-glyphicon';

export default gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    processMarkup,
    processCSS,
    prepareFontAwesome,
    prepareBootstrapGlyphicon
  ),
  writeBundles
);

function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}
