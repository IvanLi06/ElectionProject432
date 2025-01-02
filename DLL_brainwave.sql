--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Ubuntu 16.1-1.pgdg22.04+1)
-- Dumped by pg_dump version 16.1 (Ubuntu 16.1-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

--
-- Name: society; Type: TABLE; Schema: public; Owner: student
--

CREATE TABLE public.society (
    "societyID" SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    abbrev TEXT NOT NULL,
    research_area TEXT
);

ALTER TABLE public.society OWNER TO student;

--
-- Name: ballot; Type: TABLE; Schema: public; Owner: student
--

CREATE TABLE public.ballot (
    "ballotID" SERIAL PRIMARY KEY,
    "societyID" INTEGER REFERENCES public.society("societyID") ON DELETE CASCADE,
    "startTime" DATE NOT NULL,
    "endTime" DATE NOT NULL,
    active BOOLEAN NOT NULL,
    title TEXT NOT NULL,
    content JSON
);

ALTER TABLE public.ballot OWNER TO student;

--
-- Name: userType; Type: TABLE; Schema: public; Owner: student
--

CREATE TABLE public."userType" (
    "userTypeID" SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    permissions JSON NOT NULL
);

ALTER TABLE public."userType" OWNER TO student;

--
-- Name: result; Type: TABLE; Schema: public; Owner: student
--

CREATE TABLE public.result (
    "resultID" SERIAL PRIMARY KEY,
    "ballotID" INTEGER NOT NULL REFERENCES public.ballot("ballotID") ON DELETE CASCADE,
    datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    "voteDescription" JSON NOT NULL
);

ALTER TABLE public.result OWNER TO student;

--
-- Name: user; Type: TABLE; Schema: public; Owner: student
--

CREATE TABLE public."user" (
    "userID" SERIAL PRIMARY KEY,
    -- No delete on cascade
    "userTypeID" INTEGER NOT NULL REFERENCES public."userType"("userTypeID"),
    "lastName" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    email TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "extraData" JSON
);

ALTER TABLE public."user" OWNER TO student;

--
-- Name: log; Type: TABLE; Schema: public; Owner: student
--

CREATE TABLE public.log (
    "logID" SERIAL PRIMARY KEY,
    "ballotID" INTEGER NOT NULL REFERENCES public.ballot("ballotID"),
    "userID" INTEGER REFERENCES public.user("userID"),
    datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT NOT NULL
);

ALTER TABLE public.log OWNER TO student;

--
-- Name: user_society; Type: TABLE; Schema: public; Owner: student
--

CREATE TABLE public.user_society (
    "userID" INTEGER NOT NULL,
    "societyID" INTEGER NOT NULL,
    active BOOLEAN NOT NULL,
    PRIMARY KEY ("userID", "societyID"),
    FOREIGN KEY ("userID") REFERENCES public.user("userID") ON DELETE CASCADE,
    FOREIGN KEY ("societyID") REFERENCES public.society("societyID") ON DELETE CASCADE
);

ALTER TABLE public.user_society OWNER TO student;

--
-- Name: vote; Type: TABLE; Schema: public; Owner: student
--

CREATE TABLE public.vote (
    "voteID" SERIAL PRIMARY KEY,
    "userID" INTEGER NOT NULL REFERENCES public.user("userID"),
    "ballotID" INTEGER NOT NULL REFERENCES public.ballot("ballotID"),
    "hasVoted" BOOLEAN NOT NULL,
    "votedTime" TIMESTAMP WITH TIME ZONE NOT NULL
);

ALTER TABLE public.vote OWNER TO student;

--
-- PostgreSQL database dump complete
--
