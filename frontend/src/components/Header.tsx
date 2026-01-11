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
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    maxWidth: "1400px",
    padding: "0 2rem",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },

  brandName: {
    color: "white",
    fontSize: "1.5rem",
    fontWeight: 700,
    letterSpacing: "-0.5px",
  },

  links: {
    display: "flex",
    gap: "0.5rem",
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(10)} ${rem(16)}`,
    borderRadius: theme.radius.md,
    textDecoration: "none",
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
    transition: "all 0.2s ease",
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      color: "white",
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      color: "white",
      fontWeight: 600,
      backdropFilter: "blur(10px)",
    },
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    paddingLeft: "1rem",
    borderLeft: "1px solid rgba(255, 255, 255, 0.3)",
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  userName: {
    color: "white",
    fontSize: "0.95rem",
    fontWeight: 500,
    margin: 0,
  },

  loginButton: {
    background: "white",
    color: "#B31B1B",
    border: "none",
    padding: "0.6rem 1.5rem",
    borderRadius: theme.radius.md,
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",

    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    },
  },

  mobileMenu: {
    position: "absolute",
    top: "70px",
    left: 0,
    right: 0,
    background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    padding: "1rem",
    animation: "slideDown 0.3s ease",
  },

  mobileLink: {
    display: "block",
    color: "rgba(255, 255, 255, 0.85)",
    textDecoration: "none",
    padding: "1rem",
    borderRadius: theme.radius.md,
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
    backgroundColor: "transparent",
    marginBottom: "0.5rem",
    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
  },

  mobileLinkActive: {
    color: "white",
    fontWeight: 600,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },

  mobileUserSection: {
    borderTop: "1px solid rgba(255, 255, 255, 0.3)",
    paddingTop: "1rem",
    marginTop: "0.5rem",
  },

  mobileUserName: {
    color: "white",
    margin: "0 0 1rem 1rem",
    fontSize: "0.95rem",
  },

  mobileLoginButton: {
    width: "100%",
    background: "white",
    color: "#B31B1B",
    border: "none",
    padding: "0.75rem",
    borderRadius: theme.radius.md,
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
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
    <Header 
      height={70}
      sx={{
        background: "linear-gradient(135deg, #B31B1B 0%, #8B0000 100%)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        border: "none",
      }}
    >
      <Container className={classes.header} size="xl">
        <Link to="/" className={classes.logo}>
          <img
            src="big_red.png"
            alt="Logo"
            style={{ 
              height: "40px", 
              width: "40px",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />
          <span className={classes.brandName}>CornellGuessr</span>
        </Link>

        <Group spacing="xl" style={{ flex: 1, justifyContent: "flex-end" }}>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>

          <div className={classes.userSection}>
            {user && <p className={classes.userName}>Hello, {user.displayName}</p>}
            <button onClick={handleLoginClick} className={classes.loginButton}>
              {user ? "Sign out" : "Log in"}
            </button>
          </div>

          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
            color="white"
          />
        </Group>
      </Container>

      {/* Mobile menu */}
      {opened && (
        <div className={classes.mobileMenu}>
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.link}
              className={cx(classes.mobileLink, {
                [classes.mobileLinkActive]: activePath === link.link,
              })}
              onClick={close}
            >
              {link.label}
            </Link>
          ))}
          
          <div className={classes.mobileUserSection}>
            {user && (
              <p className={classes.mobileUserName}>
                Hello, {user.displayName}
              </p>
            )}
            <button onClick={handleLoginClick} className={classes.mobileLoginButton}>
              {user ? "Sign out" : "Log in"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Header>
  );
}