push_hook=$(<./hooks/pre-push)
echo "$push_hook" >> ./.git/hooks/pre-push
if [ -e ./.git/hooks/pre-push ]; then
  echo "ok"
else
  echo "nok"
fi