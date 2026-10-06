# PostgreSQL

## Verificar se está sendo executado na porta 5432

```bash
sudo lsof -i :5432

COMMAND  PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
postgres 334 postgres    5u  IPv4  20802      0t0  TCP localhost:postgresql (LISTEN)
```

## Verificar o Status

```bash
sudo systemctl status postgresql
● postgresql.service - PostgreSQL RDBMS
     Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; vendor preset: enabled)
     Active: active (exited) since Sat 2026-09-26 20:44:57 -03; 1 week 2 days ago
   Main PID: 1515 (code=exited, status=0/SUCCESS)

Sep 26 20:44:57 DESKTOP-059018K systemd[1]: Starting PostgreSQL RDBMS...
Sep 26 20:44:57 DESKTOP-059018K systemd[1]: Finished PostgreSQL RDBMS.
```

## Se você não precisa dele rodando, pare:

```bash
sudo systemctl stop postgresql
```

Se não quiser que ele inicie automaticamente:

```bash
sudo systemctl disable postgresql

Synchronizing state of postgresql.service with SysV service script with /lib/systemd/systemd-sysv-install.
Executing: /lib/systemd/systemd-sysv-install disable postgresql
Removed /etc/systemd/system/multi-user.target.wants/postgresql.service.
```

