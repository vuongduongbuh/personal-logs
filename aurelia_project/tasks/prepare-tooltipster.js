import gulp from 'gulp';
import merge from 'merge-stream';
import changedInPlace from 'gulp-changed-in-place';
import project from '../aurelia.json';

export default function prepareTooltipster() {
  const source = 'node_modules/tooltipster';

  const taskCss = gulp.src(`${source}/dist/css/tooltipster.bundle.min.css`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/css`));

  const taskThemeCss = gulp.src(`${source}/dist/css/plugins/tooltipster/sideTip/themes/tooltipster-sideTip-shadow.min.css`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(gulp.dest(`${project.platform.output}/css`));

  return merge(taskCss, taskThemeCss);
}