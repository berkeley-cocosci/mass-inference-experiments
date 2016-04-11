# Mass inference experiments

This repository contains the [psiTurk](http://psiturk.org) experiment code to
run the mass inference experiments. It also contains pointers to the stimuli for
the experiments which are stored in Amazon S3 and can be retrieved using
[git annex](https://git-annex.branchable.com/).

## Downloading the stimuli

> **Note:** The stimuli for all three experiments take up about 2GB of space
> total.

To download the stimuli, you will need an Amazon AWS account. First, make sure
you have exported your access key id and secret access key to the appropriate
environment variables:

```bash
export AWS_ACCESS_KEY_ID="my_access_key_id"
export AWS_SECRET_ACCESS_KEY="my_secret_access_key"
```

Make sure you have [git annex](https://git-annex.branchable.com/) installed, and
then run:

```bash
git annex init
git annex enableremote s3
```

To then download *all* the stimuli, run:

```bash
git annex get --from s3
```

To get the stimuli only for a particular experiment (for example,
`experiment1`), run:

```bash
git annex get --from s3 experiment1
```
