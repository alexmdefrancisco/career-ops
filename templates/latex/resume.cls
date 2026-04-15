%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Resume v2 - refined single-page CV class
% Goals: stronger hierarchy, accent color, ATS-safe, 1-page discipline.
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\ProvidesClass{resume}[2026/04/15 v2.0 Resume class]
\LoadClass[10pt,letterpaper]{article}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{fontawesome}
\usepackage{xcolor}
\usepackage{array}
\usepackage{ifthen}
\usepackage[parfill]{parskip}
\usepackage[protrusion=true,expansion=false]{microtype}
\usepackage{enumitem}
\usepackage{helvet}

\pagestyle{empty}

% --- Palette ---
\definecolor{accent}{HTML}{0B3D91}   % deep navy, reads as serious finance / engineering
\definecolor{muted}{HTML}{5F6B7A}    % subtle gray for dates / locations

% --- Icons ---
\newcommand{\phonesymbol}{\textcolor{accent}{\faPhone}}
\newcommand{\emailsymbol}{\textcolor{accent}{\faEnvelope}}
\newcommand{\githubsymbol}{\textcolor{accent}{\faGithub}}
\newcommand{\linkedinsymbol}{\textcolor{accent}{\faLinkedin}}

% --- Name ---
\def\name#1{\def\@name{#1}}
\def\@name{}
\def\headline#1{\def\@headline{#1}}
\def\@headline{}

% --- Address / contact lines ---
\def\addressSep{\;\textcolor{muted}{\small\textbullet}\;}
\let\@addressone\relax
\let\@addresstwo\relax
\def\address#1{%
  \@ifundefined{@addresstwo}{\def\@addresstwo{#1}}{\def\@addressone{#1}}%
}

\def\printname{%
  \begin{center}
    {\color{accent}\fontsize{20}{24}\selectfont\bfseries\sffamily \@name}%
    \ifthenelse{\equal{\@headline}{}}{}{%
      \\[2pt]{\color{muted}\sffamily\small \@headline}%
    }
  \end{center}
  \vspace{-2pt}
}
\def\printaddress#1{%
  \begin{center}\small #1\end{center}\vspace{-2pt}
}

\let\ori@document=\document
\renewcommand{\document}{%
  \ori@document
  \printname
  \@ifundefined{@addressone}{}{\printaddress{\@addressone}}
  \@ifundefined{@addresstwo}{}{\printaddress{\@addresstwo}}
}

% --- Section ---
\newenvironment{rSection}[1]{%
  \vspace{6pt}%
  \noindent{\sffamily\bfseries\color{accent}\MakeUppercase{#1}}\par
  \vspace{2pt}%
  {\color{accent}\hrule height 0.5pt}%
  \vspace{0pt}%
  \begin{list}{}{%
    \setlength{\leftmargin}{0em}%
    \setlength{\itemsep}{0pt}%
    \setlength{\parsep}{0pt}%
    \setlength{\topsep}{0pt}%
  }%
  \item[]%
}{\end{list}\vspace{-4pt}}

% --- Subsection: {company}{dates}{role}{location} ---
\newif\if@rshasitems
\def\rs@openlist{%
  \begin{list}{\color{accent}\footnotesize\textbullet}{%
    \setlength{\leftmargin}{1.1em}%
    \setlength{\itemsep}{0pt}%
    \setlength{\parsep}{0pt}%
    \setlength{\topsep}{0pt}%
    \setlength{\partopsep}{0pt}%
  }%
}
\newenvironment{rSubsection}[4]{%
  \noindent{\bfseries #1}\hfill{\color{muted}\small #2}%
  \ifthenelse{\equal{#3}{}}{\par\vspace{1pt}}{%
    \par\vspace{1pt}%
    {\slshape #3}\hfill{\color{muted}\slshape\small #4}\par\vspace{2pt}%
  }%
  \@ifnextchar\item{\@rshasitemstrue\rs@openlist}{\@rshasitemsfalse}%
}{%
  \if@rshasitems\end{list}\fi
  \vspace{2pt}%
}
