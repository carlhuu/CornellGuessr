import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";
import { signIn, signOut } from "../auth/auth";
import { useAuth } from "../auth/AuthUserProvider";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "start",
    gap: "2rem",
    alignItems: "center",
    height: "100%",
    position: "relative",
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).color,
    },
  },
}));

interface HeaderSimpleProps {
  links: { link: string; label: string }[];
}

export function HeaderSimple({ links }: HeaderSimpleProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { classes, cx } = useStyles();
  const location = useLocation();
  const activePath = location.pathname;

  const { user } = useAuth();

  const handleLoginClick = async () => {
    if (user) {
      await signOut();
    } else {
      await signIn();
    }
  };

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: activePath === link.link,
      })}
      onClick={close}
    >
      {link.label}
    </Link>
  ));

  return (
    <Header height={60}>
      <Container className={classes.header}>
        <Link to="/">
          <img
            src="big_red.png"
            alt="Logo"
            style={{ height: "28px", width: "28px", marginLeft: "20px" }}
          />
        </Link>
        <Group spacing={5} className={classes.links}>
          {items}
        </Group>
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />
        <div
          style={{
            width: "40vw",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {user && <p className="center">Hello, {user.displayName}</p>}
          <button onClick={handleLoginClick}>
            {user ? "Sign out" : "Log in"}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {opened && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: 0,
            right: 0,
            backgroundColor: "white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: "1rem",
            zIndex: 999,
          }}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.link}
              className={cx(classes.link, {
                [classes.linkActive]: activePath === link.link,
              })}
              onClick={close}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </Header>
  );
}
