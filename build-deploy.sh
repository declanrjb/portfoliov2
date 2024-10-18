hugo
git add *
git commit -m 'update site'
cd themes/hugo-theme-console
git add *
git commit -m 'update theme'
git push origin master
cd ../..
git add *
git commit -m 'deploy site'
git push origin main
