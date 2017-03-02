import gulp from 'gulp';
import merge from 'merge-stream';
import changedInPlace from 'gulp-changed-in-place';
import project from '../aurelia.json';

export default function prepareSweetAlert2() {
  const source = 'node_modules/sweetalert2';

  const taskCss = gulp.src(`${source}/dist/sweetalert2.min.css`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/css`));

  return merge(taskCss);
}